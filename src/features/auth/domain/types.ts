export type User = {
    id: string;
    name:string;
    email: string;
    role: "USER" | "MODERATOR";
    status: "ACTIVE" | "BLOCKED"
    createAt:string;
}

export type SessionUser = {
    email:string;
    name:string;
    role:string;
}