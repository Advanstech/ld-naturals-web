"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Shield, Truck, Sparkles, Loader2, ArrowRight, User, Trash2, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchApi } from "@/lib/api";

export default function CheckoutPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [countryCode, setCountryCode] = useState<string>("GH");
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [isProcessing, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedItems, setCompletedItems] = useState<typeof items>([]);

  const shippingCost = countryCode === "GH" ? 20 : 150;
  const displaySubtotal = orderCompleted 
    ? completedItems.reduce((t, i) => t + i.price * i.quantity, 0) 
    : totalPrice;
  const finalTotal = displaySubtotal + shippingCost;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProfileData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProfileData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileData = await fetchApi('/auth/me');
      const addresses = await fetchApi('/users/me/addresses');

      if (profileData) {
        const defaultFirstName = profileData.firstName || '';
        const defaultLastName = profileData.lastName || '';
        const defaultFullName = [defaultFirstName, defaultLastName].filter(Boolean).join(' ');

        if (defaultFullName) form.setFieldValue('fullName', defaultFullName);
        if (profileData.phone) form.setFieldValue('phoneNumber', profileData.phone);
      }

      if (addresses && addresses.length > 0) {
        const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
        if (defaultAddr.street) form.setFieldValue('address', defaultAddr.street);
        if (defaultAddr.city) form.setFieldValue('city', defaultAddr.city);
        if (defaultAddr.country) setCountryCode(defaultAddr.country);
      }
    } catch (e) {
      console.error("Failed to load profile data for checkout", e);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code) {
          setCountryCode(data.country_code);
        }
      } catch (err) {
        console.warn("Could not auto-detect location, falling back to GH", err);
      } finally {
        setDetectingLocation(false);
      }
    }
    detectCountry();
  }, []);

  const form = useForm({
    defaultValues: {
      email: session?.user?.email || "",
      fullName: "",
      address: "",
      city: "",
      phoneNumber: "",
      network: "mtn",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) throw new Error("Not authenticated");

        const orderItems = items.map(i => ({ slug: i.slug, quantity: i.quantity }));

        const response = await fetch("http://localhost:3001/api/v1/orders/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            items: orderItems,
            customerInfo: {
              email: value.email,
              firstName: value.fullName.split(" ")[0] || "",
              lastName: value.fullName.split(" ").slice(1).join(" ") || "",
              phone: value.phoneNumber,
            },
            shippingAddr: {
              street: value.address,
              city: value.city,
              country: countryCode,
            },
            paymentMethod: countryCode === "GH" ? value.network : "stripe",
            shippingMethod: "swoove"
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || "Failed to process checkout");
        }

        setPaymentUrl(result.paymentUrl);
        setPaymentSuccess(true);
        setOrderCompleted(true);
        setCompletedItems([...items]);
        clearCart();

        // Redirect to order confirmation
        setTimeout(() => {
           router.push(`/order-confirmation?id=${result.order.id}`);
        }, 4000);

      } catch (error: any) {
        console.error("Payment failed", error);
        alert(`Checkout Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const getGateway = () => {
    if (countryCode === "GH") {
      return {
        name: "Paystack (Ghana-First)",
        methods: "MTN MoMo, Telecel Cash, AT Money, Cards",
        extra: "USSD Push Notification will be sent to your phone"
      };
    } else {
      return {
        name: "Stripe Global",
        methods: "Visa, Mastercard, AMEX, Apple Pay, Google Pay",
        extra: "Secure global payment processor"
      };
    }
  };

  const gateway = getGateway();

  if (items.length === 0 && !paymentSuccess && !orderCompleted) {
    return (
      <main className="relative bg-ivory text-cocoa min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-40 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-cocoa/30" />
          <h2 className="font-cormorant text-4xl mb-4">Your cart is empty</h2>
          <p className="mb-8 text-cocoa/70">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => router.push('/#products')}
            className="inline-flex rounded-full bg-cocoa px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold transition hover:bg-terracotta"
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative bg-ivory text-cocoa min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-cocoa/10 shadow-lg">
              <h3 className="font-cormorant text-3xl mb-6 border-b border-cocoa/10 pb-4">
                {orderCompleted ? "Your Order" : "Order Summary"}
              </h3>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {(orderCompleted ? completedItems : items).map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cocoa/5 shrink-0">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-cocoa/60 uppercase tracking-widest mt-1">GH₵ {item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        {!orderCompleted && (
                          <>
                            <div className="flex items-center gap-2 bg-white/60 rounded-full px-2 py-1 border border-cocoa/10">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center text-cocoa/60 hover:text-cocoa">-</button>
                              <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center text-cocoa/60 hover:text-cocoa">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-terracotta/70 hover:text-terracotta transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {orderCompleted && (
                          <span className="text-xs text-cocoa/50">× {item.quantity}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      GH₵ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-cocoa/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-cocoa/70">Subtotal</span>
                  <span className="font-semibold">GH₵ {displaySubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cocoa/70">Shipping</span>
                  <span className="font-semibold">GH₵ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-cocoa/10">
                  <span className="font-semibold text-base uppercase tracking-widest">Total</span>
                  <span className="font-semibold text-lg">GH₵ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-cocoa/5">
              <div className="flex gap-4 items-start mb-4">
                <div className="p-2 bg-cocoa/5 rounded-lg text-terracotta">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs mb-1">Secure Checkout</h4>
                  <p className="text-[10px] opacity-70 leading-relaxed">Your payment information is encrypted and secure. We do not store your credit card details.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Billing Form */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-cocoa/10 shadow-lg">
              <h2 className="font-cormorant text-3xl mb-6">Delivery & Billing</h2>
              
              {!session ? (
                <div className="bg-white/60 rounded-xl p-8 border border-cocoa/10">
                  <div className="text-center mb-6">
                    <User className="w-8 h-8 text-gold mx-auto mb-2" />
                    <h3 className="font-cormorant text-2xl">Account Access</h3>
                    <p className="text-xs uppercase tracking-widest text-cocoa/70 mt-2">
                      Please {authMode} to continue checkout
                    </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4">
                    {authError && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg">{authError}</div>}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        required
                        className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Password</label>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                        className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-4 bg-cocoa text-ivory rounded-xl text-sm uppercase tracking-widest font-semibold hover:bg-terracotta transition-all disabled:opacity-50"
                    >
                      {authLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : authMode === "login" ? "Sign In" : "Create Account"}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className="text-xs uppercase tracking-widest font-semibold text-cocoa/70 hover:text-cocoa"
                    >
                      {authMode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </div>
              ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field name="fullName">
                      {(field) => (
                        <div>
                          <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Full Name</label>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="email">
                      {(field) => (
                        <div>
                          <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Email Address</label>
                          <input
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Field name="address">
                    {(field) => (
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Street Address</label>
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                        />
                      </div>
                    )}
                  </form.Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field name="city">
                      {(field) => (
                        <div>
                          <label className="block text-xs uppercase tracking-widest font-semibold mb-2">City</label>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            required
                            className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                          />
                        </div>
                      )}
                    </form.Field>

                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Country</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa h-[46px]"
                      >
                        <option value="GH">Ghana (GH)</option>
                        <option value="US">United States (US)</option>
                        <option value="CA">Canada (CA)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="NG">Nigeria (NG)</option>
                      </select>
                    </div>
                  </div>

                  <form.Field name="phoneNumber">
                    {(field) => (
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          className="w-full bg-white/60 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cocoa"
                          placeholder={countryCode === "GH" ? "024 XXX XXXX" : "+1 (XXX) XXX-XXXX"}
                        />
                      </div>
                    )}
                  </form.Field>

                  {countryCode === "GH" && (
                    <form.Field name="network">
                      {(field) => (
                        <div>
                          <label className="block text-xs uppercase tracking-widest font-semibold mb-2">Mobile Money Network</label>
                          <div className="grid grid-cols-3 gap-3">
                            {["mtn", "telecel", "at"].map((net) => (
                              <button
                                key={net}
                                type="button"
                                onClick={() => field.handleChange(net)}
                                className={`py-3 rounded-xl border text-xs uppercase tracking-widest font-semibold transition-all ${
                                  field.state.value === net
                                    ? "bg-cocoa text-ivory border-cocoa"
                                    : "bg-white/40 border-cocoa/10 hover:border-cocoa/30"
                                }`}
                              >
                                {net === "mtn" ? "MTN MoMo" : net === "telecel" ? "Telecel" : "AT Money"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </form.Field>
                  )}

                  {/* Payment Gateway Info */}
                  <div className="p-4 bg-cocoa/5 rounded-xl border border-cocoa/10 flex items-start gap-4">
                    <CreditCard className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest mb-1">Paying with {gateway.name}</h4>
                      <p className="text-[10px] text-cocoa/70">{gateway.methods}. {gateway.extra}</p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-cocoa text-ivory rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-terracotta transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing Securely
                      </>
                    ) : (
                      <>
                        Complete Payment — GH₵ {finalTotal.toFixed(2)} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Simulated Success Message */}
            {paymentSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl p-8 text-center animate-fade-in">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-cormorant text-2xl font-bold mb-2">Order Initialized!</h3>
                <p className="text-sm mb-4 leading-relaxed">
                  Thank you for nourishing daily. Your order is being processed.
                </p>
                {paymentUrl && (
                  <a 
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 mb-4 bg-emerald-600 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-emerald-700"
                  >
                    Click to Pay
                  </a>
                )}
                <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  Redirecting to confirmation...
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
