"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Package, LogOut, ArrowRight, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);
      fetchOrders(session.access_token);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);
      fetchOrders(session.access_token);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="bg-ivory min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-cocoa border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-ivory text-cocoa min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-32 max-w-6xl">
        <div className="flex items-center gap-4 mb-12 border-b border-cocoa/10 pb-8">
          <div className="w-16 h-16 bg-cocoa/10 rounded-full flex items-center justify-center text-cocoa shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-cormorant text-4xl mb-1">My Account</h1>
            <p className="text-sm text-cocoa/70">{session?.user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-terracotta hover:bg-terracotta/10 rounded-full transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Order History */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="font-cormorant text-3xl mb-6">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="bg-white/40 rounded-2xl p-12 text-center border border-cocoa/10">
                <Package className="w-12 h-12 mx-auto text-cocoa/30 mb-4" />
                <h3 className="font-semibold mb-2">No orders yet</h3>
                <p className="text-sm text-cocoa/60 mb-6">When you place an order, it will appear here.</p>
                <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-terracotta hover:text-cocoa transition-colors">
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/40 rounded-2xl p-6 border border-cocoa/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-cocoa/10 pb-4">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-cocoa/60 mb-1">Order Number</div>
                        <div className="font-semibold">{order.orderNumber}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-cocoa/60 mb-1">Date</div>
                        <div className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-cocoa/60 mb-1">Status</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                          order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-widest text-cocoa/60 mb-1">Total</div>
                        <div className="font-bold text-lg">GH₵ {order.total.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-12 h-12 bg-cocoa/5 rounded-lg relative overflow-hidden shrink-0">
                            {item.product?.images?.[0]?.url && (
                              <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.product?.name || 'Product'}</h4>
                            <p className="text-xs text-cocoa/60">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-cocoa/10 flex justify-end">
                      <Link 
                        href={`/order-confirmation?id=${order.id}`}
                        className="text-xs font-semibold uppercase tracking-widest text-terracotta hover:text-cocoa transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings / Address */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cocoa text-ivory rounded-2xl p-8 border border-gold/20 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-gold" />
                <h3 className="font-cormorant text-2xl text-gold">Account Settings</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-ivory/60 mb-1">Email</label>
                  <p>{session?.user?.email}</p>
                </div>
                <div className="pt-4 border-t border-ivory/10">
                  <p className="text-ivory/70 text-xs leading-relaxed">
                    To update your password or default shipping address, please contact support or complete a new checkout which will save your new address.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
