export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  category: string;
  previews: {
    id: string;
    imageUrl: string;
    imageHint: string;
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
