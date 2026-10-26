'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useCatalog } from '@/lib/store';
export default function Header(){
  const {theme,setTheme}=useTheme();const [m,setM]=useState(false);useEffect(()=>setM(true),[]);
  const {referralPi}=useCatalog();
  const next={system:'light',light:'dark',dark:'system'} as const;
  const icon=!m?'◐':theme==='light'?'☀️':theme==='dark'?'🌙':'🖥️';
  async function share(){
    const url=`${location.origin}/?ref=sosa.pi`;const text=`Check SOSA COLLECTIONS — Made in Nigeria — sosa.pi (referral reward ${referralPi} Pi)`;
    try{ if(navigator.share) await navigator.share({title:'SOSA-outfits',text,url}); else {await navigator.clipboard.writeText(`${text} ${url}`);alert('Link copied')} }catch{}
  }
  function rate(){const v=prompt('Rate SOSA 1-5');const n=Number(v);if(n>=1&&n<=5){localStorage.setItem('sosa-rating-v18',String(n));alert('Thank you!')}}
  return(<header style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderBottom:'1px solid var(--line)',flexWrap:'wrap'}}>
    <img src="/logo.jpg" alt="SOSA logo" width={44} height={44} style={{objectFit:'contain',borderRadius:8,background:'#fff'}}/>
    <div style={{lineHeight:1.1}}><b>SOSA-outfits</b><br/><small>SOSA.PI</small></div>
    <span style={{flex:1}}/>
    <button onClick={rate}>⭐ Rate Us</button><button onClick={share}>Share</button>
    <button aria-label="Colour mode" onClick={()=>setTheme(next[(theme as keyof typeof next)||'system'])}>{icon}</button>
  </header>);
}
