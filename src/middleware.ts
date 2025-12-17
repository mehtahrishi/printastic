import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const isAdminLoggedIn = request.cookies.has("admin_session");
    const { pathname } = request.nextUrl;

    // If trying to access any protected admin route and not logged in, redirect to login
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (pathname.startsWith("/admin/login") && isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Apply middleware to all admin routes
    matcher: ["/admin/:path*"],
};
