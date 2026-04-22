"use server"

import { revalidatePath } from "next/cache";
import { sendApprovalEmail, sendRejectionEmail } from "../lib/email/ses";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function requireModerator(){
    const session = await auth();

    if(session?.user.role !== "MODERATOR") {
        throw new Error ("Unauthorized please Login via Moderator Account to process...");
    }
    return session;
}

export async function createCategory(formData: FormData){
    await requireModerator();

    const name = formData.get("name") as string;
    const parentId = formData.get("parentId") as string | null;

    const slug = name.toLowerCase().replaceAll(/\s+/g, "-");

    await prisma.category.create({
        data: {
            name,
            slug,
            parentId: parentId || null,
        },
    });
    return { success:true};
}
export async function getCategories() {
    return prisma.category.findMany({
        include: {
            children: true,
        },
        orderBy: {createdAt : "desc"},
    });
}

export async function createLocation(formData: FormData){
    await requireModerator();
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replaceAll(/\s+/g, "-");

    await prisma.location.create({
        data: {name, slug},
    });
    return { success:true }
}

export async function getLocations() {
    return prisma.location.findMany({
        orderBy: {createdAt:"desc"},
    });
}

export async function approveAdvertisements(_prevState: unknown, formData: FormData) {
    await requireModerator();
    const adId = formData.get("adId") as string;
    const note = formData.get("note") as string;

    if(!adId) {
        return { error: "Ad ID is required" };
    }
    try{
        const ad = await prisma.advertisement.update({
            where: { id: adId},
            data: {
                status: "ACTIVE",
            },
            include: {
                user:true,
            },
        });

        sendApprovalEmail({
            to: ad.user.email,
            adTitle: ad.title,
            note,
        }).catch((error) => {
            console.error("Failed to send approval email", error);
        });

        revalidatePath("/moderator/pending");
        revalidatePath("/dashboard");
        return { success:true };
    } catch (error) {
        console.error(error);
        return {error: "Failed to approve advertisement"};
    }
}

export async function rejectAdvertisements(_prevState: unknown, formData: FormData) {
    await requireModerator();

    const adId = formData.get("adId") as string;
    const reason = (formData.get("reason") as string | null)?.trim() ?? "";

    if (!adId) {
        return { error: "Ad ID is required" };
    }

    if (!reason) {
        return { error: "Rejection reason is required" };
    }

    try {
        const ad = await prisma.advertisement.update({
            where: { id: adId },
            data: {
                status: "REJECTED",
            },
            include: {
                user: true,
            },
        });

        sendRejectionEmail({
            to: ad.user.email,
            adTitle: ad.title,
            reason,
        }).catch((error) => {
            console.error("Failed to send rejection email", error);
        });

        revalidatePath("/moderator/pending");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to reject advertisement" };
    }
}

export async function getPendingAdvertisements() {
        await requireModerator();

        return prisma.advertisement.findMany({
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
}