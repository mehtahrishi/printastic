import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin Portal - Honesty Print House",
    description: "Admin access only",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isAdminLoggedIn = cookieStore.has("admin_session");

    // The middleware now handles redirects for unauthenticated users,
    // so if we reach this layout, we are either on the login page or logged in.

    // If not logged in, we are on the /admin/login page, so we don't show the sidebar.
    if (!isAdminLoggedIn) {
        return (
            <div className="flex min-h-screen flex-col bg-background font-body antialiased">
                <AdminHeader isLoggedIn={false} />
                <main className="flex-1 w-full">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    // If logged in, show the full admin layout with sidebar.
    return (
        <div className="flex min-h-screen flex-col bg-background font-body antialiased">
            <AdminHeader isLoggedIn={true} />
            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
