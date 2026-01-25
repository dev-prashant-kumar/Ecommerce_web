import { Header } from "@/components/homePage/Header";
import { CartSheet } from "@/components/layout/CartSheet";
// import SanityProvider from "@/components/layout/SanityProvider";
import { Toaster } from "@/components/ui/sonner";
import { CartStoreProvider } from "@/lib/store/cart_store_provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";


function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {/* <SanityProvider> */}
      <CartStoreProvider>
        <Header />
        <main>{children}</main>
        <CartSheet />
        <Toaster position="top-center" />
        <SanityLive />
      </CartStoreProvider>
      {/* </SanityProvider> */}
    </ClerkProvider>
  );
}

export default Layout;
