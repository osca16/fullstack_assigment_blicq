import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            if (!user.email) {
                return false;
            }

            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });

            if (existingUser) {
                return true;
            }

            await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.name,
                    role: "USER",
                },
            });

            return true;
        },
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;