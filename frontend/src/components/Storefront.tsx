"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts, type Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
export function Storefront({initialProducts}:{initialProducts:Product[]}) {
  const [products,setProducts]=useState(initialProducts),[search,setSearch]=useState(""),[category,setCategory]=useState("All"),[loading,setLoading]=useState(false),[error,setError]=useState("");
  const categories=useMemo(()=>["All",...Array.from(new Set(products.map(p=>p.category)))],[products]);
  useEffect(()=>{let active=true;setLoading(true);fetchProducts({search,category}).then(p=>{if(active){setProducts(p);setError("")}}).catch(()=>{if(active)setError("Could not refresh products from the API. Showing the latest available list.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[search,category]);
  return <><div className="filters"><input className="search" aria-label="Search products" placeholder="Search products, categories..." value={search} onChange={e=>setSearch(e.target.value)}/>{categories.map(c=><button key={c} className={`filter ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>{error&&<p className="muted">{error}</p>}{loading&&<p className="muted">Updating products…</p>}{products.length?<div className="grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty"><h2>No products found</h2><p className="muted">Try another search or category.</p></div>}</>
}
