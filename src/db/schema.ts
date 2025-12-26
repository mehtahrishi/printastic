
import { mysqlTable, int, varchar, text, timestamp, decimal, boolean, json, datetime } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    address: varchar("address", { length: 255 }),
    apartment: varchar("apartment", { length: 255 }),
    city: varchar("city", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    password: text("password").notNull(),
    role: varchar("role", { length: 50 }).default("USER"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = mysqlTable("products", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    category: varchar("category", { length: 100 }),
    sizes: json("sizes").$type<string[]>(),
    colors: json("colors").$type<string[]>(),
    images: json("images").$type<string[]>().notNull(),
    isTrending: boolean("is_trending").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: datetime("updated_at"),
});

export const productPreviews = mysqlTable("product_previews", {
    id: int("id").autoincrement().primaryKey(),
    productId: int("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
    setting: varchar("setting", { length: 100 }).notNull(),
    imageUrl: text("image_url").notNull(),
    imageHint: text("image_hint"),
});

export const cartItems = mysqlTable("cart_items", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: int("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
    quantity: int("quantity").notNull().default(1),
    size: varchar("size", { length: 50 }),
    color: varchar("color", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const wishlistItems = mysqlTable("wishlist_items", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: int("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const orders = mysqlTable("orders", {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("Processing"), // Processing, On the way, Out for delivery, Delivered, Rejected, On hold
    shippingAddress: text("shipping_address").notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const orderItems = mysqlTable("order_items", {
    id: int("id").autoincrement().primaryKey(),
    orderId: int("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: int("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
    quantity: int("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at the time of purchase
    size: varchar("size", { length: 50 }),
    color: varchar("color", { length: 50 }),
});

export const otpAttempts = mysqlTable("otp_attempts", {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const passwordResetTokens = mysqlTable("password_reset_tokens", {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
});
