'use client'
import { useEffect } from 'react';

export default function AdminPage(){
  useEffect(()=>{
    window.location.href='/?admin=1';
  },[]);
  return <div style={{padding:100, textAlign:'center'}}>Redirecting to Admin...</div>;
}
