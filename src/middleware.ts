import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

    const {pathname} = req.nextUrl;
    if (pathname.startsWith("/dashboard")){
        if(!token){
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if(pathname.startsWith("/moderator")){
        if(!token){
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/moderator/:path*"],
};