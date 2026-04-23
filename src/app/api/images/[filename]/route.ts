import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * GET /api/images/[filename]
 *
 * Serves a single advertisement image from the local filesystem path
 * configured by ADVERTISEMENTS_SAVE_PATH_LOCAL.
 *
 * Security: the filename segment is sanitised to prevent path-traversal.
 * Only the basename is used — any directory component is stripped.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
): Promise<NextResponse> {
  const { filename } = await params;

  // Sanitise: reject any attempt to traverse directories.
  const safeName = path.basename(decodeURIComponent(filename));
  if (!safeName || safeName !== decodeURIComponent(filename).replace(/\\/g, "/").split("/").pop()) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const saveRoot = process.env.ADVERTISEMENTS_SAVE_PATH_LOCAL?.trim();
  if (!saveRoot) {
    return new NextResponse("Image storage is not configured", { status: 500 });
  }

  const absolutePath = path.join(saveRoot, safeName);

  try {
    const fileBuffer = await readFile(absolutePath);

    const ext = path.extname(safeName).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };
    const contentType = contentTypeMap[ext] ?? "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 1 hour in the browser, 1 day on CDN/edge.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }
}
