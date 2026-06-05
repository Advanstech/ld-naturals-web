'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, LogOut, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-cocoa text-ivory">
      <div className="flex h-16 items-center px-6 border-b border-ivory/10">
        <span className="text-xl font-cormorant font-bold uppercase tracking-widest">E-Naturals Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive ? 'bg-terracotta text-white' : 'text-ivory/80 hover:bg-terracotta/50 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-ivory/60 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ivory/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-md text-ivory/80 hover:bg-terracotta/50 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-ivory/60" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
