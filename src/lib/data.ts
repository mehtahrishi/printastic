
import type { Product, Customer, Order } from "./types";
import { PlaceHolderImages } from "./placeholder-images";

const findImage = (id: string) => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img)
    return {
      imageUrl: "https://picsum.photos/seed/error/600/800",
      imageHint: "placeholder image",
    };
  return { imageUrl: img.imageUrl, imageHint: img.imageHint };
};

const previewSettings = [
  {
    id: "preview_living_room",
    setting: "Living Room",
  },
  {
    id: "preview_office",
    setting: "Office",
  },
  {
    id: "preview_bedroom",
    setting: "Bedroom",
  },
];

export const products: Product[] = [
  {
    id: "13",
    name: "Jujutsu Kaisen Tee",
    slug: "jujutsu-kaisen-tee",
    description: "A stylish black t-shirt featuring a character from the popular anime Jujutsu Kaisen.",
    price: 89.99,
    category: "Anime",
    images: ["/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fproject-spark-301223.appspot.com%2Fstatic%2Fuser%2F169747864459-Yuji_Itadori_Jujutsu_Kaisen_t-shirt_mockup_on_a_hanger_in_a__9a37774e-e17f-4315-9c60-0a256a468d6c.png&w=3840&q=75"],
    previews: previewSettings.map(p => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "1",
    name: "Azure Dreams",
    slug: "azure-dreams",
    description:
      "A stunning abstract watercolor piece featuring deep blues and vibrant gold accents, perfect for a modern living space.",
    price: 59.99,
    category: "Abstract",
    images: [findImage("prod_1").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "2",
    name: "Summit Serenity",
    slug: "summit-serenity",
    description:
      "A minimalist depiction of a mountain range at dawn, conveying a sense of peace and tranquility. Ideal for office or study spaces.",
    price: 49.99,
    category: "Landscapes",
    images: [findImage("prod_2").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "3",
    name: "Monstera Majesty",
    slug: "monstera-majesty",
    description:
      "A detailed botanical illustration of a monstera leaf, bringing a touch of nature indoors. A great fit for any room.",
    price: 39.99,
    category: "Botanical",
    images: [findImage("prod_3").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "4",
    name: "Golden Geometry",
    slug: "golden-geometry",
    description:
      "A striking geometric pattern in black and gold, offering a bold and sophisticated statement piece.",
    price: 69.99,
    category: "Geometric",
    images: [findImage("prod_4").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "5",
    name: "Wanderer's Map",
    slug: "wanderers-map",
    description:
      "A beautifully crafted vintage-style world map that evokes a sense of adventure and nostalgia.",
    price: 79.99,
    category: "Vintage",
    images: [findImage("prod_5").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "6",
    name: "Coastal Calm",
    slug: "coastal-calm",
    description:
      "A serene photograph of a tranquil beach at sunset, capturing the beauty of the coast.",
    price: 54.99,
    category: "Photography",
    images: [findImage("prod_6").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "7",
    name: "Vivid Vision",
    slug: "vivid-vision",
    description:
      "A colorful pop art portrait that adds a burst of energy and personality to any wall.",
    price: 45.99,
    category: "Pop Art",
    images: [findImage("prod_7").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "8",
    name: "Landmark Lines",
    slug: "landmark-lines",
    description:
      "An intricate architectural sketch of a world-famous landmark, perfect for the architecture enthusiast.",
    price: 64.99,
    category: "Architecture",
    images: [findImage("prod_8").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "9",
    name: "Modern Motivation",
    slug: "modern-motivation",
    description:
      "An inspirational quote rendered in elegant, modern calligraphy to keep you motivated.",
    price: 34.99,
    category: "Typography",
    images: [findImage("prod_9").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "10",
    name: "Nursery Friend",
    slug: "nursery-friend",
    description:
      "A charming and cute illustrated animal, designed to bring joy to a nursery or child's room.",
    price: 29.99,
    category: "For Kids",
    images: [findImage("prod_10").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "11",
    name: "Simplistic Soul",
    slug: "simplistic-soul",
    description: "An abstract, single-line art drawing of a face. Minimalist and expressive.",
    price: 42.99,
    category: "Line Art",
    images: [findImage("prod_11").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
  {
    id: "12",
    name: "Urban Glow",
    slug: "urban-glow",
    description: "A vibrant photograph of a city skyline at night, full of energy and light.",
    price: 55.99,
    category: "Photography",
    images: [findImage("prod_12").imageUrl],
    previews: previewSettings.map((p) => ({ ...p, ...findImage(p.id) })),
  },
];

export const customers: Customer[] = [
  { id: "cust_1", name: "Alice Johnson", email: "alice.j@example.com", avatar: "https://i.pravatar.cc/150?u=cust_1", registeredDate: "2023-01-15" },
  { id: "cust_2", name: "Bob Williams", email: "bob.w@example.com", avatar: "https://i.pravatar.cc/150?u=cust_2", registeredDate: "2023-02-20" },
  { id: "cust_3", name: "Charlie Brown", email: "charlie.b@example.com", avatar: "https://i.pravatar.cc/150?u=cust_3", registeredDate: "2023-03-10" },
  { id: "cust_4", name: "Diana Miller", email: "diana.m@example.com", avatar: "https://i.pravatar.cc/150?u=cust_4", registeredDate: "2023-04-05" },
  { id: "cust_5", name: "Ethan Davis", email: "ethan.d@example.com", avatar: "https://i.pravatar.cc/150?u=cust_5", registeredDate: "2023-05-21" },
];

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "cust_1",
    customerName: "Alice Johnson",
    customerEmail: "alice.j@example.com",
    date: "2024-05-20",
    total: 109.98,
    status: "Delivered",
    items: [
      { productId: "1", productName: "Azure Dreams", quantity: 1, price: 59.99 },
      { productId: "2", productName: "Summit Serenity", quantity: 1, price: 49.99 },
    ],
  },
  {
    id: "ORD-002",
    customerId: "cust_2",
    customerName: "Bob Williams",
    customerEmail: "bob.w@example.com",
    date: "2024-06-10",
    total: 39.99,
    status: "Shipped",
    items: [{ productId: "3", productName: "Monstera Majesty", quantity: 1, price: 39.99 }],
  },
  {
    id: "ORD-003",
    customerId: "cust_3",
    customerName: "Charlie Brown",
    customerEmail: "charlie.b@example.com",
    date: "2024-07-01",
    total: 149.98,
    status: "Processing",
    items: [
      { productId: "5", productName: "Wanderer's Map", quantity: 1, price: 79.99 },
      { productId: "4", productName: "Golden Geometry", quantity: 1, price: 69.99 },
    ],
  },
  {
    id: "ORD-004",
    customerId: "cust_1",
    customerName: "Alice Johnson",
    customerEmail: "alice.j@example.com",
    date: "2024-07-15",
    total: 34.99,
    status: "Processing",
    items: [{ productId: "9", productName: "Modern Motivation", quantity: 1, price: 34.99 }],
  },
  {
    id: "ORD-005",
    customerId: "cust_4",
    customerName: "Diana Miller",
    customerEmail: "diana.m@example.com",
    date: "2024-07-18",
    total: 29.99,
    status: "Pending",
    items: [{ productId: "10", productName: "Nursery Friend", quantity: 1, price: 29.99 }],
  },
  {
    id: "ORD-006",
    customerId: "cust_5",
    customerName: "Ethan Davis",
    customerEmail: "ethan.d@example.com",
    date: "2024-07-20",
    total: 55.99,
    status: "Delivered",
    items: [{ productId: "12", productName: "Urban Glow", quantity: 1, price: 55.99 }],
  },
  {
    id: "ORD-007",
    customerId: "cust_2",
    customerName: "Bob Williams",
    customerEmail: "bob.w@example.com",
    date: "2024-07-21",
    total: 42.99,
    status: "Shipped",
    items: [{ productId: "11", productName: "Simplistic Soul", quantity: 1, price: 42.99 }],
  },
];

    