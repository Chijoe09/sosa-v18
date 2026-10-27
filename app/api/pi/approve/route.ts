import { NextResponse } from 'next/server';
import { sb, PI_API, piHeaders } from '@/lib/supabase';
export async function POST(req:Request){
  const db=sb();if(!db)return NextResponse.json({error:'no db'},{status:503});
  const {paymentId,orderId}=await req.json();
  const {data:o}=await db.from('orders').select('*').eq('id',orderId).single();
  if(!o||o.status==='paid')return NextResponse.json({error:'Invalid order'},{status:400});
  const pr=await fetch(`${PI_API}/payments/${paymentId}`,{headers:piHeaders()});
  if(!pr.ok)return NextResponse.json({error:'Pi lookup failed'},{status:502});
  const pay=await pr.json();
  if(Math.abs(Number(pay.amount)-Number(o.total))>1e-9||pay.metadata?.orderId!==orderId)return NextResponse.json({error:'Amount mismatch'},{status:400});
  const r=await fetch(`${PI_API}/payments/${paymentId}/approve`,{method:'POST',headers:piHeaders()});
  if(!r.ok)return NextResponse.json({error:'Approve failed'},{status:502});
  await db.from('orders').update({payment_id:paymentId}).eq('id',orderId);
  return NextResponse.json({ok:true});
}
