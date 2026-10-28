'use client'
import { useState, useEffect } from 'react';
import AdminRoom from '@/components/AdminRoom';

export default function AdminPage(){
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    // Auto-auth if already logged from admin.html
    if(localStorage.getItem('sosa_admin')==='true'){
      setAuth(true);
    }
  },[]);

  function login(){
    if(pw==='sosa5463'){
      localStorage.setItem('sosa_admin','true');
      localStorage.setItem('sosa_admin_direct','true');
      setAuth(true);
    } else {
      setMsg('❌ Wrong Password! Use sosa5463');
    }
  }

  if(!auth){
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111',color:'white'}}>
        <div style={{background:'#222',padding:'30px',borderRadius:'12px',textAlign:'center',width:'320px'}}>
          <h2>SOSA Admin</h2>
          <p>Direct Access</p>
          <input 
            type="password" 
            value={pw} 
            onChange={e=>setPw(e.target.value)}
            placeholder="Password"
            style={{padding:'12px',width:'90%',margin:'15px 0',borderRadius:'8px',border:'none'}}
          />
          <br/>
          <button onClick={login} style={{padding:'12px 30px',background:'gold',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>LOGIN</button>
          <p style={{color:'#ff6666',marginTop:'10px'}}>{msg}</p>
        </div>
      </div>
    );
  }

  // Authenticated - show admin room
  return (
    <div style={{minHeight:'100vh',background:'#111',paddingTop:'20px'}}>
      <div style={{textAlign:'center',color:'gold',padding:'10px'}}>
        <h2>✅ Admin Logged In - SOSA</h2>
        <button onClick={()=>{localStorage.removeItem('sosa_admin'); window.location.href='/'}} style={{padding:'5px 15px'}}>Logout</button>
      </div>
      <AdminRoom />
    </div>
  );
}
