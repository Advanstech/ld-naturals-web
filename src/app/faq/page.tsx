"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    category: "Product & Ingredients",
    items: [
      {
        q: "What makes your black soap different?",
        a: "Unlike mass-produced soaps that use synthetic dyes to achieve a black color, our traditional African black soap is authentic. It gets its rich color naturally from roasted plantain skins and cocoa pods. We then super-fat our bars with raw Ghanaian cocoa butter for deep moisturization."
      },
      {
        q: "Is it suitable for sensitive skin?",
        a: "Yes. Our Fragrance-Free bar is specifically formulated for sensitive skin. It contains zero essential oils or artificial fragrances, relying solely on the soothing properties of cocoa butter and the gentle clarification of traditional black soap."
      },
      {
        q: "How long does a bar last?",
        a: "With daily use, our 100g artisan bars typically last 3-4 weeks. To extend the life of your bar, keep it dry between uses on a well-draining soap dish, away from direct streams of water."
      }
    ]
  },
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship to most countries worldwide from our facility in Accra. International shipping rates are calculated at checkout based on your location and order weight."
      },
      {
        q: "Can I change or cancel my order?",
        a: "If you need to change or cancel your order, please email us within 2 hours of placing it. Once an order has been processed for shipping, we can no longer make changes."
      }
    ]
  }
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>("What makes your black soap different?");

  return (
    <main className="relative bg-ivory text-cocoa min-h-screen">
      <Navbar />
      
      <section className="relative overflow-hidden bg-[#e6dcc3] px-6 py-40 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(216,200,58,0.1),transparent_40%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-terracotta">Support</p>
          <h1 className="font-cormorant text-6xl italic md:text-8xl">Frequently Asked<br/>Questions</h1>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl space-y-16">
          {faqs.map((group) => (
            <div key={group.category}>
              <h2 className="mb-8 font-cormorant text-3xl italic text-terracotta">{group.category}</h2>
              <div className="space-y-4">
                {group.items.map((faq) => {
                  const isOpen = openItem === faq.q;
                  return (
                    <div 
                      key={faq.q} 
                      className={`rounded-[1.5rem] border transition-colors duration-300 ${isOpen ? 'border-cocoa/20 bg-white/60' : 'border-cocoa/10 bg-white/30 hover:border-cocoa/20'}`}
                    >
                      <button
                        onClick={() => setOpenItem(isOpen ? null : faq.q)}
                        className="flex w-full items-center justify-between p-6 text-left"
                      >
                        <span className="font-cormorant text-2xl">{faq.q}</span>
                        <span className="ml-4 shrink-0 text-gold bg-cocoa rounded-full p-1.5">
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-6 pt-0 text-sm leading-7 text-cocoa/75">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="text-center pt-10 border-t border-cocoa/10">
            <p className="text-sm text-cocoa/70 mb-4">Still have questions?</p>
            <a href="/contact" className="inline-flex rounded-full border border-cocoa/20 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa transition hover:bg-cocoa hover:text-ivory">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
