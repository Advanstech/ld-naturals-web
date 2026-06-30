import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import { CartProvider } from "@/context/CartContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Live Daily | Natural Skincare",
  description: "World-class natural soap products. Nourish Daily with Nature's Touch.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html lang="en" nonce={nonce || undefined} suppressHydrationWarning className={`${cormorant.variable} ${inter.variable} antialiased`}>
      <body className="bg-ivory text-cocoa font-inter min-h-screen flex flex-col">
        <CartProvider>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </CartProvider>
      </body>
    </html>
  );
}
