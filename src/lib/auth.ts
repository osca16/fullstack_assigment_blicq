import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

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

                const dbUser = await prisma.user.findUnique({
                    where:{id:user.id},
                    select: {id: true, name: true, email: true, role: true, status:true},
                });
                if(dbUser){
                    session.user.role = dbUser.role;
                    session.user.name = dbUser.name;
                    session.user.email = dbUser.email;
                    session.user.id = dbUser.id;
                    session.user.status = dbUser.status;
                }
            }
            return session;
        },

        async signIn({user}){
            if (!user.email){
                return false;
            }

            const dbUser = await prisma.user.findUnique({
                where: {email:user.email},
            });

            if (!dbUser){
                return true;
            }

            if (dbUser.status === "BLOCKED"){
                return false;
            }
            return true;
        }
    },
});