"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/api";
import { useCart } from "@/components/CartProvider";
export function ProductActions({product}:{product:Product}) {
  const {add}=useCart();const [added,setAdded]=useState(false);
  return <div className="detail-actions"><button className="button" disabled={!product.stock} onClick={()=>{add(product);setAdded(true)}}>{added?"Added to bag ✓":"Add to bag +"}</button><Link href="/cart" className="button secondary">View bag</Link></div>
}
