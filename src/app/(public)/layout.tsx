
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    <CartProvider>
      <WishlistProvider>
        <div className="flex min-h-screen flex-col">
          <Header user={user} />
          <main className="flex-1">{children}</main>
          <div className="py-12 text-center">
            <p
              className="text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-moon-time)",
                color: "#7B3F00",
              }}
            >
              "Crystal clear prints, from our House to yours."
            </p>
          </div>
          <Footer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
