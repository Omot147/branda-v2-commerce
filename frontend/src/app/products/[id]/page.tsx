import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProducts, formatNaira } from "@/lib/api";
import { ProductActions } from "./product-actions";

export async function generateMetadata({params}:{params:{id:string}}) {
  try { const products=await fetchProducts(); const p=products.find(x=>x.id===params.id); if(p)return {title:p.name,description:p.description,alternates:{canonical:`/products/${p.id}`},openGraph:{title:p.name,description:p.description,images:[p.image]}}; } catch {}
  return {title:"Product"};
}
export default async function ProductPage({params}:{params:{id:string}}) {
  let products=[]; try { products=await fetchProducts(); } catch {}
  const product=products.find(p=>p.id===params.id); if(!product) notFound();
  const jsonLd={"@context":"https://schema.org","@type":"Product","name":product.name,"description":product.description,"image":product.image,"sku":product.id,"offers":{"@type":"Offer","priceCurrency":"NGN","price":product.price,"availability":product.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock"}};
  return <main className="container page"><Link href="/" className="muted">← Back to collection</Link><div className="detail"><div><Image className="detail-image" src={product.image} alt={product.name} width={1000} height={1000} unoptimized priority/></div><div><div className="eyebrow">{product.category}</div><h1>{product.name}</h1><div className="detail-price">{formatNaira(product.price)}</div><p className="detail-desc">{product.description}</p><p className="status">{product.stock>0?`${product.stock} available to order`:"Currently out of stock"}</p><ProductActions product={product}/><p className="muted" style={{fontSize:12,lineHeight:1.7}}>Orders are recorded by the demo backend. Payment processing is not enabled in this starter.</p></div></div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/></main>
}
