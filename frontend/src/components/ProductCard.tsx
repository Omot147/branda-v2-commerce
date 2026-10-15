"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/api";
import { formatNaira } from "@/lib/api";
import { useCart } from "./CartProvider";
export function ProductCard({product}:{product:Product}) {
  const {add}=useCart(); const [added,setAdded]=useState(false);
  return <article className="product"><Link href={`/products/${product.id}`} className="product-image"><Image src={product.image} alt={product.name} width={800} height={800} unoptimized/><span className="tag">{product.featured?"Featured":product.category}</span></Link><div className="product-meta"><div><Link href={`/products/${product.id}`}><h3>{product.name}</h3></Link><span className="category">{product.category}</span></div><span className="price">{formatNaira(product.price)}</span></div><div className="product-bottom"><span className="stock">{product.stock>0?`${product.stock} available`:"Out of stock"}</span><button className="small-button" disabled={product.stock<1} onClick={()=>{add(product);setAdded(true);setTimeout(()=>setAdded(false),1300)}}>{added?"Added ✓":"Add to bag +"}</button></div></article>
}
