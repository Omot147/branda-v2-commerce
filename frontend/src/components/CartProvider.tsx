"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/lib/api";

type CartContextType = { items: CartItem[]; count:number; add:(p:Product, qty?:number)=>void; setQty:(id:string, qty:number)=>void; remove:(id:string)=>void; clear:()=>void };
const CartContext = createContext<CartContextType | null>(null);
export function CartProvider({children}:{children:React.ReactNode}) {
  const [items,setItems] = useState<CartItem[]>([]);
  const [ready,setReady] = useState(false);
  useEffect(()=>{ try { const raw=localStorage.getItem("branda-cart"); if(raw) setItems(JSON.parse(raw)); } catch {} setReady(true); },[]);
  useEffect(()=>{ if(ready) localStorage.setItem("branda-cart",JSON.stringify(items)); },[items,ready]);
  const value = useMemo(()=>({
    items, count:items.reduce((n,i)=>n+i.quantity,0),
    add:(p:Product,qty=1)=>setItems(old=>{ const found=old.find(i=>i.product.id===p.id); return found ? old.map(i=>i.product.id===p.id?{...i,quantity:Math.min(i.quantity+qty,p.stock)}:i) : [...old,{product:p,quantity:Math.min(qty,p.stock)}]; }),
    setQty:(id:string,qty:number)=>setItems(old=>old.map(i=>i.product.id===id?{...i,quantity:Math.max(1,Math.min(qty,i.product.stock))}:i)),
    remove:(id:string)=>setItems(old=>old.filter(i=>i.product.id!==id)), clear:()=>setItems([])
  }),[items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart must be used inside CartProvider");return value;}
