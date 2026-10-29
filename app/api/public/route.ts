import { NextResponse } from 'next/server';
import { db, getSettings, mapProduct } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export async function GET() {
  const [settingsRes, productsRes] = await Promise.all([
    getSettings(db),
    db.from('products').select('*')
  ]);
  let products = (productsRes.data || []).map((r:any)=>{
    const p = mapProduct(r);
    return {
      ...p,
      pricePi: p.pricePi && p.pricePi > 0 ? p.pricePi : 0.05,
      price: (p as any).pricePi && (p as any).pricePi > 0 ? (p as any).pricePi : 0.05,
      stock: p.stock && p.stock > 0 ? p.stock : 20,
    };
  });
  if (!products.length) {
    const { seedItems } = await import('@/lib/catalog');
    const { DEFAULTS } = await import('@/lib/settings');
    return NextResponse.json({ settings: DEFAULTS, products: seedItems() });
  }
  return NextResponse.json({ settings: settingsRes, products });
}
