import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
export const metadata={title:'SOSA-outfits | SOSA.PI',description:'SOSA COLLECTIONS — Made in Nigeria'};
export default function Root({children}:{children:React.ReactNode}){
  return(<html lang="en" suppressHydrationWarning><body><Providers><Header/><main>{children}</main>
    <footer style={{padding:12,fontSize:12,opacity:.8}}>SOPHISTICATED SAMPLES MERCHANDISE · BN 2229053 · CRBN 177764 · No.1 Odiche Street, Coker, Lagos · +2348087259800</footer>
  </Providers></body></html>);
}
