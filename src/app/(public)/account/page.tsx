import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account/account-form";

export default async function AccountPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) {
        redirect("/login");
    }

    // Ensure userId is valid
    if (isNaN(parseInt(userId))) {
        redirect("/signout");
    }

    const user = await db.select().from(users).where(eq(users.id, parseInt(userId))).then(res => res[0]);

    if (!user) {
        redirect("/signout");
    }

    return (
        <div className="container py-10 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            <AccountForm user={user} />
        </div>
    );
}
