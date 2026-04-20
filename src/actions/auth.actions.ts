"use server";

import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "../lib/auth";

export async function loginWithGoogle(){
    const session = await auth();
    if (session?.user) {
        redirect("/dashboard");
    }

    await signIn ("google", {
        redirectTo: "/dashboard"
    });
}

export async function logout() {
    await signOut({redirectTo: "/"});
}