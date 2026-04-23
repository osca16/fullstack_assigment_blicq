import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { Role } from "@/generated/prisma/index";

function getModeratorEmails(): Set<string> {
    return new Set(
        (process.env.ACCESS_MODERATOR ?? "")
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean)
    );
}

function isModeratorEmail(email: string): boolean {
    return getModeratorEmails().has(email.trim().toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: PrismaAdapter(prisma as any),
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    access_type: "offline",
                    prompt: "consent",
                    response_type: "code",
                },
            },
        }),
    ],
    session: {
        strategy: "database",
    },

    events: {
        async createUser({ user }) {
            const email = user.email;
            if (!email || !isModeratorEmail(email)) {
                return;
            }

            await prisma.user.update({
                where: { id: user.id },
                data: { role: Role.MODERATOR },
            });
        },
    },

    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;

                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { id: true, name: true, email: true, role: true, status: true },
                });
                if (dbUser) {
                    session.user.role = dbUser.role;
                    session.user.name = dbUser.name;
                    session.user.email = dbUser.email;
                    session.user.id = dbUser.id;
                    session.user.status = dbUser.status;
                }
            }
            return session;
        },

        async signIn({ user, account, profile }) {
            const email = user.email;
            if (!email) {
                return false;
            }

            const normalizedEmail = email.toLowerCase();

            const dbUser = await prisma.user.findUnique({
                where: { email },
            });

            if (!dbUser) {
                return true;
            }

            if (isModeratorEmail(normalizedEmail) && dbUser.role !== Role.MODERATOR) {
                await prisma.user.update({
                    where: { id: dbUser.id },
                    data: { role: Role.MODERATOR },
                });
            }

            if (dbUser.status === "BLOCKED") {
                return false;
            }

            if (account?.provider === "google") {
                const googleProfile = profile as { email_verified?: boolean } | undefined;

                if (googleProfile?.email_verified === true && dbUser.emailVerified === null) {
                    await prisma.user.update({
                        where: { id: dbUser.id },
                        data: { emailVerified: new Date() },
                    });
                }
            }

            return true;
        }
    },
});
