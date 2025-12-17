import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const isAdminLoggedIn = request.cookies.has("admin_session");
    const { pathname } = request.nextUrl;

    // If trying to access any admin route other than login, and not logged in, redirect to login
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (pathname.startsWith("/admin/login") && isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/admin/:path*"],
};
