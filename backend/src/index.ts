import "dotenv/config";
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getOrders, getProducts, saveOrders, saveProducts } from "./store.js";
import type { Order, OrderItem, Product } from "./types.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: allowedOrigin.split(",").map((s) => s.trim()), methods: ["GET","POST","PATCH","DELETE","OPTIONS"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", service: "branda-v2-commerce-api" }));
app.get("/api/products", (req, res) => {
  const { search = "", category = "", featured } = req.query;
  let products = getProducts();
  if (typeof search === "string" && search.trim()) {
    const term = search.toLowerCase().trim();
    products = products.filter(p => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term));
  }
  if (typeof category === "string" && category && category !== "All") products = products.filter(p => p.category === category);
  if (featured === "true") products = products.filter(p => p.featured);
  res.json({ products, count: products.length });
});
app.get("/api/products/:id", (req, res) => {
  const product = getProducts().find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json({ product });
});

const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(7).max(30),
    address: z.string().trim().min(5).max(300),
    city: z.string().trim().min(2).max(100)
  }),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(50) })).min(1).max(100)
});
app.post("/api/orders", (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please provide valid customer details and order items.", details: parsed.error.flatten() });
  const products = getProducts();
  const items: OrderItem[] = [];
  for (const requested of parsed.data.items) {
    const product = products.find(p => p.id === requested.productId);
    if (!product) return res.status(400).json({ error: `Product ${requested.productId} is no longer available.` });
    if (product.stock < requested.quantity) return res.status(400).json({ error: `Not enough stock for ${product.name}.` });
    items.push({ productId: product.id, name: product.name, price: product.price, quantity: requested.quantity });
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const order: Order = {
    id: `ORD-${randomUUID().slice(0,8).toUpperCase()}`,
    customer: parsed.data.customer, items, subtotal, deliveryFee, total: subtotal + deliveryFee,
    status: "pending", paymentStatus: "unpaid", createdAt: new Date().toISOString()
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  // Reserve stock in the demo store when the order is created.
  const updated = products.map(p => {
    const ordered = items.find(i => i.productId === p.id);
    return ordered ? { ...p, stock: p.stock - ordered.quantity } : p;
  });
  saveProducts(updated);
  return res.status(201).json({ order, message: "Order received. Payment has not been processed." });
});

// Demo admin routes. Add authentication and authorization before public production use.
app.get("/api/admin/orders", (_req, res) => res.json({ orders: getOrders() }));
const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(1000),
  price: z.number().positive(),
  category: z.string().trim().min(2).max(60),
  image: z.string().url(),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false)
});
app.post("/api/admin/products", (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid product", details: parsed.error.flatten() });
  const products = getProducts();
  const product: Product = { ...parsed.data, id: `p-${randomUUID().slice(0,8)}`, createdAt: new Date().toISOString() };
  products.unshift(product); saveProducts(products);
  return res.status(201).json({ product });
});
app.patch("/api/admin/products/:id", (req, res) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Product not found" });
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid product update", details: parsed.error.flatten() });
  products[index] = { ...products[index], ...parsed.data };
  saveProducts(products);
  return res.json({ product: products[index] });
});
app.delete("/api/admin/products/:id", (req, res) => {
  const products = getProducts();
  const next = products.filter(p => p.id !== req.params.id);
  if (next.length === products.length) return res.status(404).json({ error: "Product not found" });
  saveProducts(next);
  return res.json({ success: true });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ error: "Unexpected server error" });
});
app.listen(port, () => console.log(`Branda V2 API listening on port ${port}`));
