'use client';
import { useState } from 'react';
import { useShop } from '@/lib/shop';
export default function Footer(){
  const {settings:s}=useShop();const [pi,setPi]=useState(false);
  const soc:[string,string,string][]=[['Instagram',s.instagram,'📸'],['Facebook',s.facebook,'f'],['X',s.x,'𝕏'],['TikTok',s.tiktok,'♪'],['Telegram',s.telegram?`https://t.me/${s.telegram.replace('@','')}`:'','✈']];
  const share=async()=>{try{if(navigator.share)await navigator.share({title:'SOSA-outfits',url:s.shareUrl});else{await navigator.clipboard.writeText(s.shareUrl);alert('Link copied')}}catch{}};
  return(<footer style={{padding:16,borderTop:'1px solid var(--line)',display:'grid',gap:10,fontSize:14}}>
    <div><b>Follow Us</b><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>{soc.map(([n,u,i])=>
      u?<a key={n} className="chip" href={u} target="_blank" rel="noreferrer">{i} {n}</a>:<span key={n} className="chip off" title="Link not set yet">{i} {n}</span>)}</div></div>
    <div>💬 WhatsApp: <a href={`https://wa.me/${s.whatsapp.replace(/\D/g,'')}`}>{s.whatsapp}</a> · ✉️ <a href={`mailto:${s.email}`}>{s.email}</a></div>
    <div>🏬 Self Pickup (Free): {s.address}</div>
    <div>🚚 Delivery: {s.deliveryInfo}</div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      <button onClick={share}>Share App</button>
      <a className="chip" href={s.mapSosaUrl} target="_blank" rel="noreferrer">📍 Sosa Map</a>
      <button onClick={()=>setPi(!pi)}>π Map Of Pi</button></div>
    {pi&&<div className="card"><b>SOSA-outfits</b> <span className="tag">Pay with Pi</span><br/>{s.address}<br/>
      <a href={s.mapPiUrl} target="_blank" rel="noreferrer">Open shop on map →</a></div>}
    <small style={{opacity:.8}}>SOPHISTICATED SAMPLES MERCHANDISE · BN 2229053 · CRBN 177764 · {s.versionText}</small>
  </footer>);
}
