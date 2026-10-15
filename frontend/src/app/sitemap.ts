import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/api";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base=process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let products=[];try{products=await fetchProducts()}catch{}
  return [{url:base,lastModified:new Date(),changeFrequency:"weekly",priority:1},...products.map(p=>({url:`${base}/products/${p.id}`,lastModified:new Date(p.createdAt),changeFrequency:"weekly" as const,priority:p.featured?0.9:0.7}))];
}
