
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AnnouncementBar } from "@/components/layout/announcement-bar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  let user = null;
  if (userId && !isNaN(parseInt(userId))) {
    user = await db.select({ name: users.name }).from(users).where(eq(users.id, parseInt(userId))).then(res => res[0] || null);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
