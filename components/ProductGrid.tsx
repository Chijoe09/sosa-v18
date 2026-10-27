'use client';
import { useEffect, useMemo, useState } from 'react';
import { useShop, fmt } from '@/lib/shop';
import CategorySlider from './CategorySlider';
import Img from './Img';
export default function ProductGrid(){
  const {boxes,products,query,settings,add,open}=useShop();
  const top=boxes.filter((b:any)=>!b.parent);
  const [cat,setCat]=useState(top[0].slug);const [sel,setSel]=useState<any>(null);
  const q=query.trim().toLowerCase();
  const name=(s:string)=>boxes.find((b:any)=>b.slug===s)?.name||s;
  const groups=useMemo(()=>{
    if(q)return [{title:`Results for "${query}"`,items:products.filter((p:any)=>`${p.name} ${name(p.box)} ${p.colours.join(' ')}`.toLowerCase().includes(q))}];
    const kids=boxes.filter((b:any)=>b.parent===cat);
    const own=products.filter((p:any)=>p.box===cat);
    return [...(own.length?[{title:'',items:own}]:[]),...kids.map((k:any)=>({title:k.name,items:products.filter((p:any)=>p.box===k.slug)}))];
  },[q,cat,products,boxes]);
  return(<section>
    <CategorySlider boxes={top} active={cat} onPick={s=>{setCat(s);setSel(null)}}/>
    {!q&&cat==='handkerchief'&&<p className="note">{settings.handkerchiefNote}</p>}
    {groups.map((g:any,gi:number)=><div key={gi}>{g.title&&<h3>{g.title}</h3>}
      {!g.items.length&&<p style={{opacity:.7}}>No products yet.</p>}
      <div className="grid">{g.items.map((p:any)=>
        <article key={p.id} onClick={()=>setSel(p)} style={{cursor:'pointer'}}>
          <Img src={p.images[0]} name={p.name}/><b>{p.name}</b>
          <span>{fmt(p.pricePi)}</span>
          <small className={p.stock>0?'ok':'out'}>{p.stock>0?`In stock (${p.stock})`:'Out of stock'}</small>
        </article>)}</div></div>)}
    {sel&&<Modal p={sel} cat={name(sel.box)} note={sel.box==='handkerchief'?settings.handkerchiefNote:''} onClose={()=>setSel(null)} add={add} open={open}/>}
  </section>);
}
function Modal({p,cat,note,onClose,add,open}:any){
  const [color,setColor]=useState(p.colours[0]);const [size,setSize]=useState(p.sizes[0]);const [v,setV]=useState(false);
  const out=p.stock<=0;
  return(<div className="overlay" onClick={onClose}><div className="box" onClick={e=>e.stopPropagation()}>
    <button style={{float:'right'}} onClick={onClose}>✕</button>
    <Img src={p.images[0]} name={p.name}/>
    <h3 style={{margin:'8px 0 2px'}}>{p.name}</h3>
    <div><b>{fmt(p.pricePi)}</b> <span className="tag">{cat}</span> <span className={out?'out':'ok'}>{out?'Out of stock':`In stock (${p.stock})`}</span></div>
    {note&&<p className="note">{note}</p>}
    <button onClick={()=>setV(!v)} style={{margin:'8px 0'}}>View Varieties</button>
    {v&&<div style={{display:'grid',gap:6}}>
      <div>Colour: {p.colours.map((c:string)=><button key={c} aria-pressed={color===c} onClick={()=>setColor(c)}>{c}</button>)}</div>
      <div>Size: {p.sizes.map((s:string)=><button key={s} aria-pressed={size===s} onClick={()=>setSize(s)}>{s}</button>)}</div></div>}
    <div style={{display:'flex',gap:8,marginTop:10}}>
      <button className="cta" disabled={out} onClick={()=>{add(p.id,size,color);onClose()}}>Add to Cart</button>
      <button className="cta" disabled={out} onClick={()=>{add(p.id,size,color);onClose();open('cart')}}>Buy with Pi</button></div>
  </div></div>);
}
