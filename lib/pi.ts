declare global{interface Window{Pi:any}}
let inited=false;
const post=(u:string,b:any)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
export function payWithPi(order:any,cb:{done:(r:any)=>void;error:(m:string)=>void}){
  const Pi=typeof window!=='undefined'?window.Pi:null;
  if(!Pi)return cb.error('Open this page in Pi Browser to pay with Pi.');
  if(!inited){Pi.init({version:'2.0',sandbox:process.env.NEXT_PUBLIC_PI_SANDBOX!=='false'});inited=true}
  Pi.authenticate(['payments'],(p:any)=>{if(p?.transaction?.txid)post('/api/pi/complete',{paymentId:p.identifier,txid:p.transaction.txid,orderId:p.metadata?.orderId})})
   .then(()=>Pi.createPayment({amount:order.total,memo:`SOSA ${order.receipt}`,metadata:{orderId:order.id}},{
     onReadyForServerApproval:(pid:string)=>post('/api/pi/approve',{paymentId:pid,orderId:order.id}),
     onReadyForServerCompletion:(pid:string,txid:string)=>post('/api/pi/complete',{paymentId:pid,txid,orderId:order.id}).then(r=>r.ok?cb.done(r):cb.error(r.error||'Completion failed')),
     onCancel:()=>cb.error('Payment cancelled'),
     onError:(e:any)=>cb.error(e?.message||'Payment error')}))
   .catch((e:any)=>cb.error(e?.message||'Pi authentication failed'));
}
export const waLink=(num:string,order:any)=>`https://wa.me/${num.replace(/\D/g,'')}?text=${encodeURIComponent(`New SOSA order ${order.receipt} — ${order.total} Pi paid. Items: ${(order.items||[]).map((i:any)=>`${i.qty}x ${i.name} (${i.color}/${i.size})`).join(', ')}`)}`;
