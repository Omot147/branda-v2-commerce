import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Order, Product } from "./types.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../data");
const productsFile = path.join(dataDir, "products.json");
const ordersFile = path.join(dataDir, "orders.json");

const seedProducts: Product[] = [
  { id:"p-1001", name:"Everyday Canvas Tote", description:"A durable everyday tote with a clean, minimalist finish. Roomy enough for work, errands and weekends.", price:18500, category:"Accessories", image:"https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000", stock:25, featured:true, createdAt:"2026-01-10T10:00:00.000Z" },
  { id:"p-1002", name:"Studio Ceramic Mug", description:"A modern ceramic mug designed for slow mornings, focused work and thoughtful gifts.", price:9500, category:"Home", image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1000", stock:30, featured:true, createdAt:"2026-01-11T10:00:00.000Z" },
  { id:"p-1003", name:"Essential Notebook", description:"A simple, premium-feel notebook for plans, sketches, ideas and daily notes.", price:6500, category:"Stationery", image:"https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1000", stock:40, featured:false, createdAt:"2026-01-12T10:00:00.000Z" },
  { id:"p-1004", name:"Everyday Backpack", description:"A versatile backpack with a streamlined silhouette for commuting and short trips.", price:42000, category:"Accessories", image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000", stock:12, featured:true, createdAt:"2026-01-13T10:00:00.000Z" },
  { id:"p-1005", name:"Soft Throw Blanket", description:"A soft, textured throw that adds warmth and a calm accent to your living space.", price:32000, category:"Home", image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000", stock:9, featured:false, createdAt:"2026-01-14T10:00:00.000Z" },
  { id:"p-1006", name:"Daily Carry Bottle", description:"A reusable bottle made for busy days, desk time and getting out the door.", price:14000, category:"Accessories", image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000", stock:18, featured:false, createdAt:"2026-01-15T10:00:00.000Z" }
];

function ensureFiles() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(productsFile)) fs.writeFileSync(productsFile, JSON.stringify(seedProducts, null, 2));
  if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}
function readJson<T>(file: string, fallback: T): T {
  ensureFiles();
  try { return JSON.parse(fs.readFileSync(file, "utf8")) as T; } catch { return fallback; }
}
function writeJson<T>(file: string, data: T) {
  ensureFiles();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
export const getProducts = () => readJson<Product[]>(productsFile, seedProducts);
export const saveProducts = (products: Product[]) => writeJson(productsFile, products);
export const getOrders = () => readJson<Order[]>(ordersFile, []);
export const saveOrders = (orders: Order[]) => writeJson(ordersFile, orders);
