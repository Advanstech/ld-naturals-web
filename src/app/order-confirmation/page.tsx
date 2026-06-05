"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Try fetching order by ID. 
        // Need to be authenticated for /orders/:id. 
        const token = session?.access_token;
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`http://localhost:3001/api/v1/orders/${orderId}`, {
          headers
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          console.error("Failed to fetch order");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-40">
        <div className="w-8 h-8 border-4 border-cocoa border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-40 text-center">
        <h2 className="font-cormorant text-4xl mb-4">Order Received</h2>
        <p className="text-cocoa/70 mb-8 max-w-md mx-auto">
          We've received your order and are processing it. Check your email for full details and tracking information.
        </p>
        <Link href="/" className="inline-flex rounded-full border border-cocoa/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa transition hover:border-cocoa hover:bg-cocoa/5">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-32">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-cormorant text-5xl mb-4">Thank You For Your Order</h1>
        <p className="text-cocoa/70">Order #{order.orderNumber}</p>
        <p className="text-sm text-cocoa/60 mt-2">A confirmation email has been sent to {order.guestEmail || order.user?.email || "you"}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Details */}
        <div className="space-y-8">
          <div className="bg-white/40 rounded-2xl p-8 border border-cocoa/10">
            <h3 className="font-semibold text-xs uppercase tracking-widest mb-6 pb-4 border-b border-cocoa/10">Items Ordered</h3>
            <div className="space-y-6">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-cocoa/5 rounded-xl relative overflow-hidden shrink-0">
                    {item.product?.images?.[0]?.url && (
                      <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.product?.name || 'Product'}</h4>
                    <p className="text-xs text-cocoa/60 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold">
                    GH₵ {item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 space-y-3 pt-6 border-t border-cocoa/10 text-sm">
              <div className="flex justify-between">
                <span className="text-cocoa/70">Subtotal</span>
                <span className="font-semibold">GH₵ {order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa/70">Shipping</span>
                <span className="font-semibold">GH₵ {order.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-cocoa/10">
                <span className="font-semibold text-base uppercase tracking-widest">Total</span>
                <span className="font-semibold text-lg">GH₵ {order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Tracking info */}
        <div className="space-y-6">
          <div className="bg-white/20 rounded-2xl p-6 border border-cocoa/5">
            <div className="flex gap-4 items-start mb-4">
              <Package className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Preparing to Ship</h4>
                <p className="text-xs text-cocoa/70 leading-relaxed">Your natural skincare rituals are being carefully packaged by our team in Accra.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-6 border border-cocoa/5">
            <div className="flex gap-4 items-start mb-4">
              <Truck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Shipping Details</h4>
                <p className="text-xs text-cocoa/70 leading-relaxed capitalize">
                  {order.shippingAddr?.street}, {order.shippingAddr?.city}<br/>
                  {order.shippingAddr?.country}
                </p>
                <div className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-cocoa/50">
                  Carrier: {order.shippingCarrier || 'Standard Delivery'}
                </div>
              </div>
            </div>
          </div>

          <Link href="/products" className="inline-flex items-center gap-2 mt-8 text-xs font-semibold uppercase tracking-widest text-terracotta hover:text-cocoa transition-colors">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <main className="relative bg-ivory text-cocoa min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex justify-center items-center py-40">
          <div className="w-8 h-8 border-4 border-cocoa border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
      <Footer />
    </main>
  );
}
