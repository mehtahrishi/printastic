
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    cookieStore.delete("admin_session");
    cookieStore.delete("temp_otp_session");
    
    // Redirect immediately after clearing cookies to prevent
    // any further code execution in the same request context
    // which might rely on the session that was just cleared.
    redirect("/");
}
