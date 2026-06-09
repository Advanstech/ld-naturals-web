"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackingTimeline from "@/components/TrackingTimeline";
import { PackageSearch, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("id") || "";
  const initialEmail = searchParams.get("email") || "";

  const [orderId, setOrderId] = useState(initialOrderId);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);

  const fetchTracking = async (id: string, userEmail: string) => {
    if (!id || !userEmail) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`http://localhost:3001/api/v1/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: id, email: userEmail })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTrackingData(data);
      } else {
        const errData = await res.json();
        setError(errData.message || "We couldn't find an order with those details. Please check and try again.");
        setTrackingData(null);
      }
    } catch (err) {
      setError("An error occurred while tracking your order. Please try again later.");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if URL params exist
  useEffect(() => {
    if (initialOrderId && initialEmail) {
      fetchTracking(initialOrderId, initialEmail);
    }
  }, [initialOrderId, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderId, email);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-32">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-cocoa/5 text-cocoa rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h1 className="font-cormorant text-5xl mb-4">Track Your Order</h1>
        <p className="text-cocoa/70 max-w-md mx-auto">
          Enter your order number and the email address used during checkout to monitor your shipment's journey.
        </p>
      </div>

      {!trackingData ? (
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-cocoa/10 shadow-[0_30px_70px_rgba(62,40,27,0.06)]">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-[0.65rem] font-bold uppercase tracking-widest text-cocoa/60 mb-2 ml-4">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. LD-2026-12345"
                  required
                  className="w-full bg-white border border-cocoa/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-cocoa/20 transition-all placeholder:text-cocoa/30"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[0.65rem] font-bold uppercase tracking-widest text-cocoa/60 mb-2 ml-4">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white border border-cocoa/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-cocoa/20 transition-all placeholder:text-cocoa/30"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cocoa text-gold rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:bg-gold hover:text-cocoa disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Track Package <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <button 
            onClick={() => setTrackingData(null)}
            className="text-xs font-semibold uppercase tracking-widest text-cocoa/50 hover:text-cocoa transition-colors"
          >
            ← Track Another Order
          </button>
          
          <TrackingTimeline 
            events={trackingData.trackingEvents || []} 
            carrier={trackingData.shippingCarrier} 
            trackingNumber={trackingData.trackingNumber || trackingData.orderNumber} 
          />
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <main className="relative bg-ivory text-cocoa min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex justify-center items-center py-40">
          <div className="w-8 h-8 border-4 border-cocoa border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </main>
  );
}
