"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Loader2, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <main className="relative bg-ivory text-cocoa min-h-screen">
      <Navbar />
      
      <section className="relative overflow-hidden bg-[#2b1b12] px-6 py-40 text-center text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(216,200,58,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold/80">Get in Touch</p>
          <h1 className="font-cormorant text-6xl italic md:text-8xl">Contact Us</h1>
          <p className="mt-6 text-sm text-ivory/70 max-w-md mx-auto leading-relaxed">
            Whether you have a question about our rituals, your order, or just want to say hello, we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-16">
          
          <div className="space-y-12">
            <div>
              <h2 className="font-cormorant text-4xl mb-6">Let's Connect</h2>
              <p className="text-sm leading-7 text-cocoa/75 mb-8">
                Fill out the form and our team will get back to you within 24-48 hours. For immediate assistance with an existing order, please reply directly to your order confirmation email.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#e6dcc3] rounded-full text-terracotta">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold mb-1">Email</h3>
                  <p className="text-sm text-cocoa/70">hello@livedailynaturals.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#e6dcc3] rounded-full text-terracotta">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold mb-1">Studio</h3>
                  <p className="text-sm text-cocoa/70">East Legon, Accra<br/>Ghana</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] border border-cocoa/10 p-8 shadow-sm">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-cormorant text-3xl mb-3">Message Sent</h3>
                <p className="text-sm text-cocoa/70">Thank you for reaching out. We will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-xs uppercase tracking-widest font-semibold text-terracotta hover:text-cocoa transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">First Name</label>
                    <input type="text" required className="w-full bg-transparent border-b border-cocoa/20 py-2 text-sm focus:outline-none focus:border-terracotta transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Last Name</label>
                    <input type="text" required className="w-full bg-transparent border-b border-cocoa/20 py-2 text-sm focus:outline-none focus:border-terracotta transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Email Address</label>
                  <input type="email" required className="w-full bg-transparent border-b border-cocoa/20 py-2 text-sm focus:outline-none focus:border-terracotta transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Subject</label>
                  <select className="w-full bg-transparent border-b border-cocoa/20 py-2 text-sm focus:outline-none focus:border-terracotta transition-colors">
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Press & Media</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-cocoa/70">Message</label>
                  <textarea required rows={4} className="w-full bg-transparent border-b border-cocoa/20 py-2 text-sm focus:outline-none focus:border-terracotta transition-colors resize-none"></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-cocoa text-ivory rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-terracotta transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}
