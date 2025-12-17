import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Admin Portal - Printastic",
    description: "Admin access only",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isAdminLoggedIn = cookieStore.has("admin_session");

    // The middleware now handles redirects, so we can simplify this layout.
    // We will always show the sidebar and header for any route under /admin,
    // as the middleware will have already kicked out unauthenticated users.
    return (
        <div className="flex min-h-screen flex-col bg-background font-body antialiased bg-grid">
            <AdminHeader isLoggedIn={isAdminLoggedIn} />
            <div className="flex flex-1">
                {isAdminLoggedIn ? (
                    <>
                        <AdminSidebar />
                        <main className="flex-1 w-full">
                            {children}
                        </main>
                    </>
                ) : (
                    // When not logged in, we render the children directly (which will be the login page)
                    // without the sidebar.
                    <main className="flex-1 w-full">
                        {children}
                    </main>
                )}
            </div>
            <Footer />
        </div>
    );
}
