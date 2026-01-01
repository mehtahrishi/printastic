
export type Product = {
  id: number | string;
  name: string;
  slug: string;
  sku?: string | null;
  description: string;
  price: number | string;
  originalPrice?: number | string;
  gsm180Price?: number | string;
  gsm240Price?: number | string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  images: string[];
  isTrending?: boolean;
  previews?: {
    id: string;
    imageUrl: string;
    setting: string;
  }[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type WishlistItem = {
  product: Product;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  registeredDate: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
};
