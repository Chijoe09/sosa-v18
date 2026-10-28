'use client'
import AdminRoom from '@/components/AdminRoom';

export default function AdminPage(){
  return (
    <div style={{minHeight:'100vh', background:'#111', paddingTop:'80px'}}>
      <div style={{textAlign:'center', color:'white', padding:'20px'}}>
        <h1>SOSA Admin</h1>
        <p>Direct admin access</p>
      </div>
      <AdminRoom forceOpen={true} />
    </div>
  );
      }
