'use client';
import { useState } from 'react';
import { useCatalog } from '@/lib/store';
export default function AdminRoom(){
  const [ok,setOk]=useState(false);const [pw,setPw]=useState('');
  const c=useCatalog();const [box,setBox]=useState(c.boxes[0].slug);const [nb,setNb]=useState('');
  async function login(){const r=await fetch('/api/admin/verify',{method:'POST',body:JSON.stringify({password:pw})});setOk(r.ok);if(!r.ok)alert('Wrong password')}
  async function upload(id:string,f?:File){if(!f)return;const rd=new FileReader();rd.onload=()=>c.updateItem(id,{images:[String(rd.result)]});rd.readAsDataURL(f)}
  if(!ok)return(<div><h3>Admin Control Room</h3><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password"/><button onClick={login}>Enter</button></div>);
  return(<div>
    <h3>Admin Control Room</h3>
    <label>Referral reward (Pi) <input type="number" step="0.0000001" value={c.referralPi} onChange={e=>c.setReferral(+e.target.value)}/></label>
    <div><input value={nb} onChange={e=>setNb(e.target.value)} placeholder="New box name"/>
      <button onClick={()=>{if(!nb)return;const slug=nb.toLowerCase().replace(/\W+/g,'-');c.addBox({slug,name:nb,kind:'misc',noun:nb,colours:['Black'],sizes:['One Size']});setNb('')}}>Create box</button>
      <small> New boxes must get 6 items before publishing.</small></div>
    <select value={box} onChange={e=>setBox(e.target.value)}>{c.boxes.map(b=><option key={b.slug} value={b.slug}>{b.name}</option>)}</select>
    <button onClick={()=>c.addItem({id:`${box}-${Date.now()}`,box,name:'New Item',colours:['Black'],sizes:['One Size'],pricePi:0.03,images:['/logo.jpg']})}>+ Item</button>
    {c.items.filter(i=>i.box===box).map(i=><div key={i.id} style={{display:'flex',gap:6,alignItems:'center'}}>
      <img src={i.images[0]} width={40} height={40} onError={e=>{(e.currentTarget as HTMLImageElement).src='/logo.jpg'}}/>
      <input value={i.name} onChange={e=>c.updateItem(i.id,{name:e.target.value})}/>
      <select value={i.pricePi} onChange={e=>c.updateItem(i.id,{pricePi:+e.target.value})}>{[0.05,0.04,0.03].map(p=><option key={p}>{p}</option>)}</select>
      <input type="file" accept="image/*" onChange={e=>upload(i.id,e.target.files?.[0])}/>
      <button onClick={()=>c.removeItem(i.id)}>Remove</button></div>)}
    <button onClick={()=>confirm('Reset catalog?')&&c.reset()}>Reset</button>
  </div>);
}
