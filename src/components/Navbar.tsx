import Link from "next/link";
import { ShoppingBag, Menu, User } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full px-4 pt-4 text-ivory">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-ivory/15 bg-cocoa/45 px-5 py-3 shadow-2xl shadow-black/20 backdrop-blur-md">
        <div className="hidden flex-1 items-center gap-6 text-xs uppercase tracking-widest whitespace-nowrap lg:flex">
          <Link href="/about" className="hover:opacity-70 transition-opacity">About Us</Link>
          <Link href="/rituals" className="hover:opacity-70 transition-opacity">Rituals</Link>
          <Link href="/heritage" className="hover:opacity-70 transition-opacity">Heritage</Link>
          <Link href="/products" className="hover:opacity-70 transition-opacity">Products</Link>
        </div>
        
        <Link href="/" className="flex-1 flex justify-center">
          <div className="relative h-16 w-16 rounded-full border border-gold/35 bg-ivory p-2 shadow-[0_0_40px_rgba(216,200,58,0.18)] md:h-20 md:w-20">
            <Image 
              src="/logo.png" 
              alt="Live Daily Logo" 
              fill
              sizes="80px"
              className="object-contain p-2"
              priority
            />
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-5">
          <Link href="/products" className="hidden lg:block text-xs uppercase tracking-widest font-semibold text-gold hover:opacity-70 transition-opacity">
            Shop
          </Link>
          <Link href="/login" className="hover:opacity-70 transition-opacity hidden md:block">
            <User className="w-5 h-5" />
          </Link>
          <button className="hover:opacity-70 transition-opacity flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium">0</span>
          </button>
          <button className="hover:opacity-70 transition-opacity md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
}
