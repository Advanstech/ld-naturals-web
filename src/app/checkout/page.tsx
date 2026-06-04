"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Shield, Truck, Sparkles, Loader2, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const [countryCode, setCountryCode] = useState<string>("GH");
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [isProcessing, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
      email: "",
      fullName: "",
      address: "",
      city: "",
      phoneNumber: "",
      network: "mtn", // for MoMo (GH)
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        // Simulate Payment routing and execution
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setPaymentSuccess(true);
      } catch (error) {
        console.error("Payment failed", error);
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
                        Complete Payment — {countryCode === "GH" ? "GH₵" : "$"} 45.00 <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
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
                <h3 className="font-cormorant text-2xl font-bold mb-2">Order Confirmed!</h3>
                <p className="text-sm mb-4 leading-relaxed">
                  Thank you for nourishing daily. Your transaction of {countryCode === "GH" ? "GH₵" : "$"}45.00 was successfully processed via {countryCode === "GH" ? "Paystack" : "Stripe"}.
                </p>
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
