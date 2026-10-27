import { NextResponse } from 'next/server';
import { sb, PI_API, piHeaders } from '@/lib/supabase';
export async function POST(req:Request){
  const db=sb();if(!db)return NextResponse.json({ok:false,error:'no db'},{status:503});
  const {paymentId,txid,orderId}=await req.json();
  const {data:o}=await db.from('orders').select('*').eq('id',orderId).single();
  if(!o)return NextResponse.json({ok:false,error:'Order not found'},{status:404});
  const receipt='SOSA-'+String(o.seq).padStart(3,'0');
  if(o.status==='paid')return NextResponse.json({ok:true,receipt,total:Number(o.total),items:o.items});
  const r=await fetch(`${PI_API}/payments/${paymentId}/complete`,{method:'POST',headers:piHeaders(),body:JSON.stringify({txid})});
  if(!r.ok)return NextResponse.json({ok:false,error:'Pi completion failed'},{status:502});
  await db.from('orders').update({status:'paid',txid,payment_id:paymentId}).eq('id',orderId);
  for(const i of o.items)await db.rpc('decrement_stock',{pid:i.id,q:i.qty});
  return NextResponse.json({ok:true,receipt,total:Number(o.total),items:o.items});
}
