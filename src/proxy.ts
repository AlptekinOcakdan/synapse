import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard", "/profile", "/projects", "/academician"];

const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function proxy(req: NextRequest) {
    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (publicRoutes.includes(path) && session?.userId) {
        if (path !== "/dashboard") {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    if (path.startsWith("/academician")) {
        if (session?.role !== "academician" && session?.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};