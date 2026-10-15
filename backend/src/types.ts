export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer: { name: string; email: string; phone: string; address: string; city: string };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  paymentStatus: "unpaid";
  createdAt: string;
};
