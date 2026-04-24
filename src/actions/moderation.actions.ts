"use server"

import { revalidatePath } from "next/cache";
import { sendApprovalEmail, sendRejectionEmail } from "../lib/email/ses";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { PendingAdvertisement, type ModerationActionState } from "../types";

export type { ModerationActionState };


async function requireModerator() {
    const session = await auth();

    if (session?.user.role !== "MODERATOR") {
        throw new Error("Unauthorized please Login via Moderator Account to process...");
    }
    return session;
}

export async function createCategory(formData: FormData): Promise<ModerationActionState> {
    await requireModerator();

    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const parentId = (formData.get("parentId") as string | null)?.trim() ?? "";

    if (!name) {
        return { success: false, error: "Category name is required" };
    }

    const slug = name.toLowerCase().replaceAll(/\s+/g, "-");

    try {
        await prisma.category.create({
            data: {
                name,
                slug,
                parentId: parentId || null,
            },
        });
        revalidatePath("/moderator/categories");
        return { success: true, message: "Category created" };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create category. Slug may already exist." };
    }
}

export async function getCategories() {
    return prisma.category.findMany({
        relationLoadStrategy: "join",
        include: {
            children: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function createLocation(formData: FormData): Promise<ModerationActionState> {
    await requireModerator();
    const name = (formData.get("name") as string | null)?.trim() ?? "";

    if (!name) {
        return { success: false, error: "Location name is required" };
    }

    const slug = name.toLowerCase().replaceAll(/\s+/g, "-");

    try {
        await prisma.location.create({
            data: { name, slug },
        });
        revalidatePath("/moderator/locations");
        return { success: true, message: "Location created" };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create location. Slug may already exist." };
    }
}

export async function getLocations() {
    return prisma.location.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function approveAdvertisements(_prevState: ModerationActionState, formData: FormData): Promise<ModerationActionState> {
    const session = await requireModerator();
    const adId = (formData.get("adId") as string | null)?.trim() ?? "";
    const note = (formData.get("note") as string | null)?.trim() ?? "";

    if (!adId) {
        return { success: false, error: "Ad ID is required" };
    }

    try {
        const ad = await prisma.advertisement.update({
            where: { id: adId },
            data: {
                status: "ACTIVE",
                moderationNote: note || null,
                moderatedById: session.user.id,
            },
            include: {
                user: true,
            },
        });

        let emailWarning = "";
        try {
            await sendApprovalEmail({
                to: ad.user.email,
                adTitle: ad.title,
                note,
            });
        } catch (error) {
            console.error("Failed to send approval email", error);
            emailWarning = " Advertisement was approved, but acceptance email failed to send.";
        }

        revalidatePath("/moderator/pending");
        revalidatePath(`/moderator/ads/${adId}`);
        revalidatePath("/moderator");
        revalidatePath("/dashboard");
        return { success: true, message: `Advertisement approved.${emailWarning}` };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to approve advertisement" };
    }
}

export async function rejectAdvertisements(_prevState: ModerationActionState, formData: FormData): Promise<ModerationActionState> {
    const session = await requireModerator();

    const adId = (formData.get("adId") as string | null)?.trim() ?? "";
    const reason = (formData.get("reason") as string | null)?.trim() ?? "";

    if (!adId) {
        return { success: false, error: "Ad ID is required" };
    }

    if (!reason) {
        return { success: false, error: "Rejection reason is required" };
    }

    try {
        const ad = await prisma.advertisement.update({
            where: { id: adId },
            data: {
                status: "REJECTED",
                moderationNote: reason,
                moderatedById: session.user.id,
            },
            include: {
                user: true,
            },
        });

        let emailWarning = "";
        try {
            await sendRejectionEmail({
                to: ad.user.email,
                adTitle: ad.title,
                reason,
            });
        } catch (error) {
            console.error("Failed to send rejection email", error);
            emailWarning = " Advertisement was rejected, but rejection email failed to send.";
        }

        revalidatePath("/moderator/pending");
        revalidatePath(`/moderator/ads/${adId}`);
        revalidatePath("/moderator");
        revalidatePath("/dashboard");
        return { success: true, message: `Advertisement rejected.${emailWarning}` };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to reject advertisement" };
    }
}

export async function getPendingAdvertisements() {
    await requireModerator();

    const ads = await prisma.advertisement.findMany({
        relationLoadStrategy: "join",
        where: { status: "PENDING" },
        select: {
            id: true,
            title: true,
            price: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
            category: { select: { name: true } },
            location: { select: { name: true } },
            images: {
                where: { isPrimary: true },
                select: { filePath: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return ads.map((ad) => ({
        ...ad,
        price: Number(ad.price),
        createdAt: ad.createdAt.toISOString(),
    })) as PendingAdvertisement[];
}

export async function getModeratorDashboardStats() {
    await requireModerator();

    const [pendingCount, activeCount, rejectedCount, totalAds, categoryCount, locationCount] = await Promise.all([
        prisma.advertisement.count({ where: { status: "PENDING" } }),
        prisma.advertisement.count({ where: { status: "ACTIVE" } }),
        prisma.advertisement.count({ where: { status: "REJECTED" } }),
        prisma.advertisement.count(),
        prisma.category.count(),
        prisma.location.count(),
    ]);

    return {
        pendingCount,
        activeCount,
        rejectedCount,
        totalAds,
        categoryCount,
        locationCount,
    };
}

export async function getAdvertisementForModeration(adId: string) {
    await requireModerator();

    return prisma.advertisement.findUnique({
        relationLoadStrategy: "join",
        where: { id: adId },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            createdAt: true,
            moderationNote: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
            location: {
                select: {
                    name: true,
                },
            },
            images: {
                select: {
                    filePath: true,
                    isPrimary: true,
                },
                orderBy: {
                    isPrimary: "desc",
                },
            },
        },
    });
}
