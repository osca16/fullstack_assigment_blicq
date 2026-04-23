import { z } from "zod";

export const createAdSchema = z.object({
    title:z
    .string()
    .trim()
    .min(5, "Title must be have at least 5 characters")
    .max(100, "Title is exceeding Character Limit"),

    description:z
    .string()
    .trim()
    .min(10, "Description should have at least 10 characters"),

    price:z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number (up to 2 decimals)"),

    categoryId:z.string().trim().min(1, "Category is required"),
    locationId:z.string().trim().min(1, "Location is Required"),
    images:z.array(z.string().trim().min(1)).optional(),
});


export type CreateAdInput = z.infer<typeof createAdSchema>;