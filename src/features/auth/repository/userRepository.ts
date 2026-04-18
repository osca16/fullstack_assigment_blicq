import {prisma} from "@/src/lib/prisma";
export const findUserByEmail = (email: string) => {
    return prisma.user.findUnique({where: {email}});
};