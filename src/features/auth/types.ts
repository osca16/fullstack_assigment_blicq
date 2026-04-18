export type User = {
    id: string;
    name:string;
    email: string;
    role: "USER" | "MODERATOR";
    status: boolean;
    createAt:string;
}

export type SessionUser = {
    email:string;
    name:string;
    role:string;
}