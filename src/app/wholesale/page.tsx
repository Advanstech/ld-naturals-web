"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WholesalePage() {
  return (
    <main className="relative bg-ivory text-cocoa min-h-screen">
      <Navbar />
      
      <section className="relative overflow-hidden bg-cocoa px-6 py-40 text-center text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(184,134,95,0.2),transparent_40%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold/80">Partner With Us</p>
          <h1 className="font-cormorant text-6xl italic md:text-8xl">Wholesale</h1>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-4xl mb-6">Stock Live Daily Naturals</h2>
            <p className="text-sm leading-7 text-cocoa/80 max-w-2xl mx-auto">
              We partner with select boutiques, spas, and wellness spaces globally who share our commitment to clean, authentic, and culturally-rooted skincare. Our products are handcrafted in small batches to ensure premium quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { title: "Premium Margins", desc: "Competitive wholesale pricing structures that support your business growth." },
              { title: "Artisan Quality", desc: "Every bar is handcrafted, cured, and individually wrapped with care." },
              { title: "Low Minimums", desc: "Accessible MOQ (Minimum Order Quantity) for independent retailers." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-[#f0e7d2] rounded-[2rem] p-8 text-center border border-cocoa/5">
                <h3 className="font-cormorant text-2xl mb-3">{feature.title}</h3>
                <p className="text-sm text-cocoa/75 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/60 rounded-[2rem] border border-cocoa/10 p-10 shadow-sm max-w-2xl mx-auto">
            <h3 className="font-cormorant text-3xl mb-6 text-center">Apply for a Wholesale Account</h3>
            <p className="text-sm text-center text-cocoa/70 mb-8">
              Please fill out the form below, and our partnerships team will review your application within 3-5 business days.
            </p>
            
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">First Name</label>
                  <input type="text" required className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Last Name</label>
                  <input type="text" required className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Business Name</label>
                <input type="text" required className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta" />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Business Website / Instagram</label>
                <input type="url" className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta" placeholder="https://" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Email Address</label>
                  <input type="email" required className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Business Type</label>
                  <select className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta h-[46px]">
                    <option>Boutique / Concept Store</option>
                    <option>Spa / Salon</option>
                    <option>Online Retailer</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Tell us about your store</label>
                <textarea rows={3} required className="w-full bg-white/50 border border-cocoa/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-terracotta resize-none"></textarea>
              </div>
              
              <button
                type="button"
                className="w-full mt-2 py-4 bg-cocoa text-ivory rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-terracotta transition-all"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
