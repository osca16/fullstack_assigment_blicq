import { AdStatus } from "@prisma/client";

export type Category = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    children?: Category[];
};

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

export type AdvertisementImage = {
    filePath: string;
    isPrimary: boolean;
};

export type UserAdvertisement = {
    id: string;
    title: string;
    description: string;
    price: number;
    status: AdStatus;
    createdAt: string;
    location: {
        name: string;
    };
    images: AdvertisementImage[];
};

export type SearchResultAd = {
    id: string;
    title: string;
    price: number;
    location: {
        name: string;
    };
    category: {
        name: string;
    };
    images: {
        filePath: string;
    }[];
};

export type PendingAdvertisement = {
    id: string;
    title: string;
    price: number;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
    category: {
        name: string;
    };
    location: {
        name: string;
    };
    images: {
        filePath: string;
    }[];
};
