'use client';
import BoxGrid from '@/components/BoxGrid';
// Replace the onAdd body with your existing cart dispatch (key = id+size+color, localStorage sosa-cart-v1).
export default function Home(){
  return <BoxGrid onAdd={(id,size,color)=>{
    const k='sosa-cart-v1';const cart=JSON.parse(localStorage.getItem(k)||'[]');
    const row=cart.find((r:any)=>r.id===id&&r.size===size&&r.color===color);
    row?row.qty++:cart.push({id,size,color,qty:1});localStorage.setItem(k,JSON.stringify(cart));
  }}/>;
}
