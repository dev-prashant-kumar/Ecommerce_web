import { ClerkProvider } from "@clerk/nextjs";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <main>{children}</main>
    </ClerkProvider>
  );
}

export default Layout;
