import { DefaultSession } from "next-auth";

declare module "next-auth"{
    interface Session {
        user: {
            id:String;
            role:"USER"|"MODERATOR";
            status:"ACTIVE"|"BLOCKED";
        }& DefaultSession["user"];
    }
}