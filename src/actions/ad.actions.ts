"use server"

import { prisma } from "@/src/lib/prisma";
import { auth } from "../lib/auth";
import { createAdSchema } from "../lib/validators/ad.schema";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg"]);

export type CreateAdvertisementState = {
    success: boolean;
    message?: string;
    adId?: string;
    error?: {
        formErrors: string[];
        fieldErrors: Record<string, string[] | undefined>;
    };
};

export type AdvertisementFormOption = {
    id: string;
    label: string;
};

function createActionError(message: string, fieldErrors?: Record<string, string[] | undefined>): CreateAdvertisementState {
    return {
        success: false,
        message,
        error: {
            formErrors: [message],
            fieldErrors: fieldErrors ?? {},
        },
    };
}

function getFormString(formData: FormData, key: string) {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
}

function getImageFileExtension(file: File) {
    const mime = file.type.toLowerCase();
    return mime === "image/png" ? ".png" : ".jpg";
}

async function saveUploadedImagesLocally(files: File[]) {
    const saveRoot = process.env.ADVERTISEMENTS_SAVE_PATH_LOCAL?.trim();

    if (!saveRoot) {
        throw new Error("ADVERTISEMENTS_SAVE_PATH_LOCAL is not configured");
    }

    await mkdir(saveRoot, { recursive: true });

    const savedPaths: string[] = [];

    for (const file of files) {
        const extension = getImageFileExtension(file);
        const fileName = `${Date.now()}-${randomUUID()}${extension}`;
        const absolutePath = path.join(saveRoot, fileName);
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        await writeFile(absolutePath, fileBuffer);
        savedPaths.push(absolutePath);
    }

    return savedPaths;
}

function validateUploadedImages(files: File[]) {
    if (!files.length) {
        return null;
    }

    for (const file of files) {
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
            const message = "Only .png and .jpg/.jpeg files are allowed";
            return createActionError(message, { images: [message] });
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            const message = "Each image must be 10MB or smaller";
            return createActionError(message, { images: [message] });
        }
    }

    return null;
}

type SearchParams = {
    query?: string;
    minPrice? : number;
    maxPrice? : number;
    categoryIds?: string[];
    locationId?: string;
};

export async function getAdvertisementFormOptions() {
    const [categories, locations] = await Promise.all([
        prisma.category.findMany({
            select: {
                id: true,
                name: true,
                parent: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        }),
        prisma.location.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    const categoryOptions: AdvertisementFormOption[] = categories.map((category) => ({
        id: category.id,
        label: category.parent ? `${category.parent.name} / ${category.name}` : category.name,
    }));

    const locationOptions: AdvertisementFormOption[] = locations.map((location) => ({
        id: location.id,
        label: location.name,
    }));

    return {
        categoryOptions,
        locationOptions,
    };
}

export async function createAdvertisement(
    _prevState: CreateAdvertisementState,
    formData: FormData
): Promise<CreateAdvertisementState> {
    const session = await auth();

    if (!session?.user){
        return createActionError("Unauthorized: please login");
    }
    
    if (session.user.role !== "USER"){
        return createActionError("Only registered users can post ads");
    }

    const uploadedFiles = formData
        .getAll("images")
        .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const uploadedImagesError = validateUploadedImages(uploadedFiles);
    if (uploadedImagesError) {
        return uploadedImagesError;
    }

    const rawData = {
        title: getFormString(formData, "title"),
        description: getFormString(formData, "description"),
        price: getFormString(formData, "price"),
        categoryId: getFormString(formData, "categoryId"),
        locationId: getFormString(formData, "locationId"),
    };

    const validated = createAdSchema.safeParse(rawData);
    if(!validated.success){
        const fieldErrors: Record<string, string[] | undefined> = {};

        for (const issue of validated.error.issues) {
            const key = issue.path[0];
            if (typeof key !== "string") {
                continue;
            }
            fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
        }

        return{
            success: false,
            message: "Please correct the highlighted fields",
            error: {
                formErrors: validated.error.issues
                    .filter((issue) => issue.path.length === 0)
                    .map((issue) => issue.message),
                fieldErrors,
            },
        };
    }
    const data = validated.data;

    let imagePaths: string[] = [];
    try {
        if (uploadedFiles.length > 0) {
            imagePaths = await saveUploadedImagesLocally(uploadedFiles);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save uploaded images";
        return createActionError(message, { images: [message] });
    }

    const ad = await prisma.advertisement.create({
        data:{
            title:data.title,
            description:data.description,
            price:Number(data.price),
            categoryId: data.categoryId,
            locationId: data.locationId,
            userId: session.user.id,
            
            images:{
                create:imagePaths.map((path, index) => ({
                    filePath :path,
                    isPrimary: index === 0,
                })),
            },
        },
    });
    revalidatePath("/dashboard");

    return {
        success: true,
        adId: ad.id,
        message: "Ad submitted successfully. It is now pending moderation.",
    };
}

export async function searchAdvertisements(params: SearchParams){
    const {
        query,
        minPrice,
        maxPrice,
        categoryIds,
        locationId,
    } = params;

    const results = await prisma.advertisement.findMany({
        where:{
            status: "ACTIVE",
            ...(query && {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
            }),
            ...((minPrice || maxPrice) && {
                price: {
                    ...(minPrice !== undefined && {gte: minPrice}),
                    ...(maxPrice !== undefined && { lte: maxPrice}),
                },
            }),
            ...(categoryIds?.length && {
                categoryId: {
                    in: categoryIds,
                },
            }),
            ...(locationId && {
                locationId: locationId,
            }),

            user:{
                status:"ACTIVE",
            },
        },

        select: {
            id:true,
            title:true,
            price:true,

            location: {
                select: { name:true },
            },
            images: {
                where: { isPrimary:true },
                select: { filePath:true },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
        take:20,
    });
    return results;
}

export async function getUserAdvertisements(userId?: string) {
    let resolvedUserId = userId;

    if (!resolvedUserId) {
        const session = await auth();
        if (session?.user?.role !== "USER") {
            return [];
        }
        resolvedUserId = session.user.id;
    }

    const ads = await prisma.advertisement.findMany({
        where: {
            userId: resolvedUserId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            createdAt: true,
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
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return ads.map((ad) => ({
        ...ad,
        price: Number(ad.price),
        createdAt: ad.createdAt.toISOString(),
    }));
}