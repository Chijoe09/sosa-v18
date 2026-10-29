'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULTS } from './settings';
import { seedItems, BOXES } from './catalog';
const Ctx=createContext<any>(null);
export const useShop=()=>useContext(Ctx);
const r7=(n:number)=>Math.round(n*1e7)/1e7;
const same=(a:any,b:any)=>a.id===b.id&&a.size===b.size&&a.color===b.color;
export function ShopProvider({children}:{children:React.ReactNode}){
  const [settings,setSettings]=useState<any>(DEFAULTS);
  const [products,setProducts]=useState<any[]>(seedItems());
  const [cart,setCart]=useState<any[]>([]);const [ready,setReady]=useState(false);
  const [delivery,setDelivery]=useState<'delivery'|'pickup'>('delivery');
  const [query,setQuery]=useState('');
  const [ui,setUi]=useState({cart:false,checkout:false,admin:false});
  const reload=useCallback(()=>fetch('/api/public',{cache:'no-store'}).then(r=>r.json()).then(d=>{
    if(d.settings)setSettings({...DEFAULTS,...d.settings});if(d.products?.length)setProducts(d.products);}).catch(()=>{}),[]);
  useEffect(()=>{reload();try{setCart(JSON.parse(localStorage.getItem('sosa-cart-v1')||'[]'))}catch{}setReady(true)},[reload]);
  useEffect(()=>{if(ready)try{localStorage.setItem('sosa-cart-v1',JSON.stringify(cart))}catch{}},[cart,ready]);
  const find=(id:string)=>products.find(p=>p.id===id);
  const add=(id:string,size:string,color:string,qty=1)=>setCart(c=>{
    const p=find(id)||{id,stock:99,price:0.05,pricePi:0.05,colours:["Black"],sizes:["One Size"],name:"Product"};
    const safeColor=color&&color!==""&&color!=="/"?color:(p.colours?.[0]||(p as any).colors?.[0]||"Black");
    const safeSize=size&&size!==""&&size!=="/"?size:(p.sizes?.[0]||"One Size");
    const row={id,size:safeSize,color:safeColor};
    const i=c.findIndex(r=>same(r,row));
    if(i<0)return [...c,{...row,qty:Math.max(1,qty)}];
    return c.map((r,j)=>j===i?{...r,qty:r.qty+qty}:r);});
  const setQty=(row:any,d:number)=>setCart(c=>c.flatMap(r=>{if(!same(r,row))return [r];const q=r.qty+d;return q<1?[]:[{...r,qty:q}]}));
  const remove=(row:any)=>setCart(c=>c.filter(r=>!same(r,row)));
  const clear=()=>setCart([]);
  const lines=cart.map(r=>{
    const p=find(r.id)||{price:0.05,pricePi:0.05,name:r.id,stock:99};
    return {...r,p:{...p,pricePi:p.pricePi||p.price||0.05,price:p.price||p.pricePi||0.05}};
  });
  const count=lines.reduce((n,l)=>n+l.qty,0);
  const subtotal=r7(lines.reduce((n,l)=>n+(l.p.pricePi||l.p.price||0.05)*l.qty,0));
  const fee=delivery==='delivery'&&lines.length?Number(settings.deliveryFee):0;
  const total=r7(subtotal+fee);
  const open=(k:string,v=true)=>setUi(u=>({...u,[k]:v}));
  return <Ctx.Provider value={{settings,products,boxes:BOXES,cart,lines,count,subtotal,fee,total,delivery,setDelivery,query,setQuery,ui,open,add,setQty,remove,clear,reload}}>{children}</Ctx.Provider>;
}
export const fmt=(n:number)=>`${Number(n).toFixed(7).replace(/0+$/,'').replace(/\.$/,'.0')} Pi`;
