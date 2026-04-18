import GoogleProvider from 'next-auth/providers/google';
import { signIn } from 'next-auth/react';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy:"jwt", 
    },

    callbacks:{
        async signIn({user}) {
            if(!user.email) return false;

            const existingUser = await prisma.user.findUnique({
                where:{email:user.email},
            });

            if(existingUser){
                return true;
            }
        }
    },
}