"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Shield, Truck, Sparkles, Loader2, ArrowRight, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
        if (error) throw error;
        // Auto sign in or prompt to check email based on settings, we'll assume auto sign-in for now
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

  // Auto-detect country code based on IP or fallback to Ghana
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

        const response = await fetch("http://localhost:3001/api/v1/orders/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            items: [
              { slug: "scented", quantity: 1 } // Hardcoded for now as cart isn't implemented
            ],
            customerInfo: {
              email: value.email,
              firstName: value.fullName.split(" ")[0] || "",
              lastName: value.fullName.split(" ").slice(1).join(" ") || "",
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

  return (
    <main className="relative bg-ivory text-cocoa min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Order Summary & Payment Method Display */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-cocoa/10 shadow-lg">
              <h2 className="font-cormorant text-3xl mb-6">1. Delivery & Billing</h2>
              
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-cocoa text-ivory rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-terracotta transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing with {countryCode === "GH" ? "Paystack" : "Stripe"}
                      </>
                    ) : (
                      <>
                        Complete Payment — {countryCode === "GH" ? "GH₵" : "$"} 120.00 <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Checkout Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-cocoa/5">
              <h3 className="font-cormorant text-2xl mb-6">Smart Payment Gateway</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-cocoa/5 rounded-xl text-terracotta">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{gateway.name}</h4>
                    <p className="text-xs opacity-70 mb-1">Active Gateway: {gateway.methods}</p>
                    <p className="text-[10px] text-terracotta font-medium uppercase tracking-wider">{gateway.extra}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-cocoa/5 rounded-xl text-terracotta">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Fully Secure & Encrypted</h4>
                    <p className="text-xs opacity-70">All connections are completely end-to-end encrypted under standard TLS protocol layers.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-cocoa/5 rounded-xl text-terracotta">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Fast Premium Shipping</h4>
                    <p className="text-xs opacity-70">Standard next-day local delivery across Accra/Tema, or 3-5 days premium international shipping.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Success Message */}
            {paymentSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-2xl p-8 text-center animate-fade-in">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-cormorant text-2xl font-bold mb-2">Order Initialized!</h3>
                <p className="text-sm mb-4 leading-relaxed">
                  Thank you for nourishing daily. Your transaction of {countryCode === "GH" ? "GH₵" : "$"}120.00 is ready to be processed.
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
                  Check your phone for USSD / Email Confirmation
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
