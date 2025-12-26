import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(null);
    }

    const user = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .then(res => res[0] || null);

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(null);
  }
}
