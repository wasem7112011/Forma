import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import { getCategories } from "@/lib/api-server";

const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: "Forma. Everyday objects, well made.",
  description: "Watches, audio, bags, footwear and more. Designed to be used daily and kept for years.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories().catch(() => []);

  return (
    <html lang="en" className={`${dm.variable} ${bricolage.variable}`}>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <Navbar categories={categories} />
          <main>{children}</main>
          <Footer categories={categories} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
