import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session:{
        strategy:"database",
    },

    callbacks:{
        async session({session, user}) {
            if (session.user){
                session.user.id = user.id;
                session.user.name = user.name;
                session.user.role = user.role;
                session.user.email = user.email;
                session.user.status = user.status;
            }
            return session;
        },

        async signIn({user}){
            const dbUser = await prisma.user.findUnique({
                where: {email:user.email!},
            });

            if (dbUser.status === "BLOCKED"){
                return false;
            }
            return true;
        }
    },

    pages: {
        signIn: "/login",
        error: "/error",
    },
});