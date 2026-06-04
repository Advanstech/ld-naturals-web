"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Sparkles, Recycle } from "lucide-react";

const essentials = [
  {
    name: "Cocoa Butter Black Soap",
    type: "Unscented",
    image: "/eco_sensitive_skin.png",
    description: "Fragrance-free clarity for sensitive skin and deep daily nourishment.",
  },
  {
    name: "Cocoa Butter Black Soap",
    type: "Signature Scented",
    image: "/eco_botanical_ritual.png",
    description: "An aromatic ritual with botanical notes and rich cocoa hydration.",
  },
  {
    name: "Heritage Care Standard",
    type: "Clean Ritual Promise",
    image: "/eco_heritage_packaging.png",
    description: "A responsible packaging and ingredient philosophy designed for everyday skin confidence.",
  },
];

export default function EcoLuxurySection() {
  return (
    <section className="bg-[#f0e7d2] px-6 py-28 text-cocoa">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.38em] text-terracotta">Eco Luxury Essentials</p>
            <h2 className="font-cormorant text-5xl italic md:text-7xl">Crafted for Daily Glow</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.15em]">
            <span className="flex items-center gap-2 rounded-full border border-cocoa/20 bg-ivory/40 px-4 py-2.5 backdrop-blur-sm"><Leaf className="h-4 w-4" /> Natural</span>
            <span className="flex items-center gap-2 rounded-full border border-cocoa/20 bg-ivory/40 px-4 py-2.5 backdrop-blur-sm"><Sparkles className="h-4 w-4" /> Premium</span>
            <span className="flex items-center gap-2 rounded-full border border-cocoa/20 bg-ivory/40 px-4 py-2.5 backdrop-blur-sm"><Recycle className="h-4 w-4" /> Eco</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {essentials.map((item) => (
            <article key={item.type} className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-cocoa/12 bg-ivory/90 shadow-[0_20px_40px_rgba(62,40,27,0.06)] transition-all hover:shadow-[0_30px_60px_rgba(62,40,27,0.12)]">
              <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-terracotta">{item.type}</p>
                <h3 className="mt-3 font-cormorant text-3xl leading-snug">{item.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-cocoa/80">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/checkout" className="inline-flex rounded-sm border border-gold/50 bg-cocoa px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-cocoa">
            Browse Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
