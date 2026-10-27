import './globals.css';
import Script from 'next/script';
import Providers from '@/components/Providers';
import { ShopProvider } from '@/lib/shop';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Welcome from '@/components/Welcome';
import CartCheckout from '@/components/CartCheckout';
import AdminRoom from '@/components/AdminRoom';
export const metadata={title:'SOSA-outfits | SOPHISTICATED SAMPLES',description:'Luxury street wears — pay with Pi'};
export default function Root({children}:{children:React.ReactNode}){
  return(<html lang="en" suppressHydrationWarning><body>
    <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive"/>
    <Providers><ShopProvider><Header/><main>{children}</main><Footer/><Welcome/><CartCheckout/><AdminRoom/></ShopProvider></Providers>
  </body></html>);
}
