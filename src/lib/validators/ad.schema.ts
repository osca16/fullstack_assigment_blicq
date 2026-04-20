import { z } from "zod";

export const createAdSchema = z.object({
    title:z
    .string()
    .min(5, "Title must be have at least 5 characters")
    .max(100, "Title is exceeding Character Limit"),

    description:z
    .string()
    .min(10, "Description should have at least 10 characters"),

    price:z
    .string()
    .regex(/^|d+(\.\d{1,2})?$/, "Invalid characters in price"),

    categoryId:z.string().min(1, "Category is required"),
    locationId:z.string().min(1, "Location is Required"),
    images:z.array(z.string()).optional(),
});

export type CreateAdInput = z.infer<typeof createAdSchema>;