export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
export type Product = { id:string; name:string; description:string; price:number; category:string; image:string; stock:number; featured:boolean; createdAt:string };
export type CartItem = { product: Product; quantity:number };
export async function fetchProducts(params: { search?:string; category?:string; featured?:boolean } = {}) {
  const url = new URL(`${API_URL}/api/products`);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.category && params.category !== "All") url.searchParams.set("category", params.category);
  if (params.featured) url.searchParams.set("featured", "true");
  const response = await fetch(url.toString(), { cache:"no-store" });
  if (!response.ok) throw new Error("Could not load products");
  return (await response.json()).products as Product[];
}
export function formatNaira(value:number) {
  return new Intl.NumberFormat("en-NG", { style:"currency", currency:"NGN", maximumFractionDigits:0 }).format(value);
}
