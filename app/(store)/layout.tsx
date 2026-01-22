import { Header } from "@/components/homePage/Header";
import { Toaster } from "@/components/ui/sonner";
import { CartStoreProvider } from "@/lib/store/cart_store_provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <Header />
        <main>{children}</main>
        <Toaster position="top-center" />
        <SanityLive />
      </CartStoreProvider>
    </ClerkProvider>
  );
}

export default Layout;
