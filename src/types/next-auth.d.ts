import { DefaultSession } from "next-auth";
import { Role, UserStatus } from "../generated/prisma/enums";

declare module "next-auth"{
    interface User{
        role: Role;
        status:UserStatus
    }

    interface Session {
        user:DefaultSession["user"]&{
            id:string;
            role:Role;
            status:UserStatus;
        };
    }
}
