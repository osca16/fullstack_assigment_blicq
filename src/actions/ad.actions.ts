"use server"


import { prisma } from "@/src/lib/prisma";
import { auth } from "../lib/auth";
import { createAdSchema } from "../lib/validators/ad.schema";
import { revalidatePath } from "next/cache";


type SearchParams = {
    query?: string;
    minPrice? : number;
    maxPrice? : number;
    categoryIds?: string[];
    locationId: string;
};
export async function createAdvertisement(formData: FormData) {
    const session = await auth();

    if (!session?.user){
        throw new Error("Unauthorized: please login");
    }
    
    if (session.user.role !== "USER"){
        throw new Error("only registered users can post ads");
    }
    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        categoryId: formData.get("categoryId"),
        locationId: formData.get("locationId"),
        images: formData.getAll("images"),
    };

    const validated = createAdSchema.safeParse(rawData);
    if(!validated.success){
        return{
            error:validated.error.flatten(),
        };
    }
    const data = validated.data;
    const ad = await prisma.advertisement.create({
        data:{
            title:data.title,
            description:data.description,
            price:Number(data.price),
            categoryId: data.categoryId,
            locationId: data.locationId,
            userId: session.user.id,
            
            images:{
                create:data.images?.map((path, index) => ({
                    filePath :path,
                    isPrimary: index === 0,
                })),
            },
        },
    });
    revalidatePath("/dashboard");

    return {sucess:true, adId: ad.id};
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
        relationLoadStrategy: "join",
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
                    ...(minPrice && {gte: minPrice}),
                    ...(maxPrice && { lte: maxPrice}),
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