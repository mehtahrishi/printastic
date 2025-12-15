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

    return (
        <div className="flex min-h-screen flex-col bg-background font-body antialiased bg-grid">
            <AdminHeader isLoggedIn={isAdminLoggedIn} />
            <div className="flex flex-1">
                {isAdminLoggedIn && <AdminSidebar />}
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
