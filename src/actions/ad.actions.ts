"use server"

import { prisma } from "@/src/lib/prisma";
import { gte, lte } from "zod";

type SearchParams = {
    query?: string;
    minPrice? : number;
    maxPrice? : number;
    categoryIds?: string[];
    locationId: string;
};

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
                    ...Decimal(maxPrice && { lte: maxPrice}),
                },
            }),
        }
    })
}