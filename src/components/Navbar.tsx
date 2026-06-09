"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, User, Settings, LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { totalItems } = useCart();
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("CUSTOMER");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole("CUSTOMER");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      // In a real app we might have a dedicated endpoint for "me" or fetch from DB.
      // Assuming Supabase metadata or fetching from backend. 
      // For now, if they are an admin they can access the admin dashboard.
      const res = await fetch(`http://localhost:3001/api/v1/admin/customers/${userId}`, {
        headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.role) setUserRole(data.role);
      }
    } catch (e) {
      console.error("Error fetching user role", e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
  };

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

        <div className="flex flex-1 items-center justify-end gap-5 relative">
          <Link href="/products" className="hidden lg:block text-xs uppercase tracking-widest font-semibold text-gold hover:opacity-70 transition-opacity">
            Shop
          </Link>
          
          <div className="relative">
            {session ? (
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:opacity-70 transition-opacity flex items-center gap-2"
                aria-label="User Profile"
              >
                <div className="relative">
                  <User className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 border-[1px] border-cocoa"></span>
                  </span>
                </div>
              </button>
            ) : (
              <Link href="/login" className="hover:opacity-70 transition-opacity hidden md:block" aria-label="Login">
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Profile Dropdown */}
            {isDropdownOpen && session && (
              <div className="absolute right-0 mt-4 w-48 bg-ivory rounded-xl shadow-xl border border-cocoa/10 py-2 text-cocoa overflow-hidden flex flex-col">
                <Link 
                  href="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="px-4 py-2 text-sm hover:bg-terracotta hover:text-white transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Profile & Settings
                </Link>
                {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2 text-sm hover:bg-terracotta hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Portal
                  </Link>
                )}
                <div className="border-t border-cocoa/10 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm hover:bg-terracotta hover:text-white transition-colors flex items-center gap-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

          <Link href="/checkout" className="hover:opacity-70 transition-opacity flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-medium">{totalItems}</span>
          </Link>

          <button className="hover:opacity-70 transition-opacity md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
}
