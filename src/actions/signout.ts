"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    cookieStore.delete("admin_session");
    cookieStore.delete("temp_otp_session");
    redirect("/");
}
