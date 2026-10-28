'use client'
import { useEffect } from 'react';
export default function AdminPage(){
  useEffect(()=>{
    localStorage.setItem('sosa_admin','true');
    localStorage.setItem('sosa_admin_pw','sosa5463');
    sessionStorage.setItem('sosa-admin','sosa5463');
    window.location.href='/?admin=1';
  },[]);
  return <div style={{padding:100,textAlign:'center',background:'#111',color:'white',minHeight:'100vh'}}>Opening SOSA Admin...</div>;
}
