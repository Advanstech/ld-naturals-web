"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: "scented",
    label: "Signature Scented",
    tag: "Aromatic Ritual • 100g",
    name: "Cocoa Butter Black Soap",
    accent: "Radiance & Aroma",
    description:
      "Infused with natural botanical aromatic notes for a luxurious daily cleansing ritual. Rich Ghanaian cocoa butter cushions the skin, leaving it smooth, luminous, and deeply nourished.",
    badges: ["Aromatic", "Glow-Boosting", "Hydrating", "All Skin Types"],
    image: "/eco_botanical_ritual.png",
    bg: "#f4ecd8",
  },
  {
    id: "unscented",
    label: "Fragrance-Free",
    tag: "Pure Calm • 100g",
    name: "Cocoa Butter Black Soap",
    accent: "Pure Calm & Care",
    description:
      "A gentle, fragrance-free daily bar designed for sensitive and melanin-rich skin. Maintains moisture barrier health while the traditional black soap base clarifies and exfoliates.",
    badges: ["Sensitive-Safe", "Clarifying", "Barrier-Care", "Unscented"],
    image: "/eco_sensitive_skin.png",
    bg: "#e9dfc2",
  },
];

const benefits = [
  { label: "100%", caption: "Natural Ingredients" },
  { label: "0%", caption: "Harmful Chemicals" },
  { label: "24h", caption: "Deep Hydration" },
  { label: "100g", caption: "Artisan Bar Weight" },
];

export default function ProductsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".prod-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 82%" },
          delay: i * 0.14,
        });
      });

      gsap.from(".benefit-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".benefits-row", start: "top 85%" },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="relative bg-ivory text-cocoa">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-[#f0e7d2] px-6 pb-20 pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(216,200,58,0.2),transparent_32%),radial-gradient(circle_at_88%_20%,rgba(184,134,95,0.22),transparent_34%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-terracotta">The Collection</p>
          <h1 className="font-cormorant text-6xl italic leading-tight md:text-8xl">
            The Ritual Pair
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-cocoa/65">
            Two handcrafted expressions of the same daily cocoa butter cleansing ritual — choose the one that speaks to your skin.
          </p>
        </div>
      </section>

      {/* Benefits row */}
      <div className="benefits-row grid grid-cols-2 divide-x divide-cocoa/10 border-y border-cocoa/10 bg-[#e6dcc3] md:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.label} className="benefit-item py-7 text-center">
            <div className="font-cormorant text-4xl">{b.label}</div>
            <div className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-cocoa/55">{b.caption}</div>
          </div>
        ))}
      </div>

      {/* Product cards */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl space-y-12">
          {products.map((p, idx) => (
            <article
              key={p.id}
              className="prod-card group overflow-hidden rounded-[2.5rem] border border-cocoa/12 shadow-[0_40px_100px_rgba(62,40,27,0.12)]"
              style={{ background: p.bg }}
            >
              <div className={`flex flex-col md:flex-row md:items-stretch ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                {/* Image */}
                <div className="relative h-80 w-full overflow-hidden md:h-auto md:w-1/2">
                  <Image
                    src={p.image}
                    alt={`${p.name} — ${p.label}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute left-5 top-5 rounded-full border border-gold/45 bg-cocoa/55 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md">
                    {p.label}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-10">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cocoa/55">{p.tag}</p>
                    <h2 className="mt-2 font-cormorant text-4xl leading-tight md:text-5xl">{p.name}</h2>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">{p.accent}</p>
                    <p className="mt-5 text-sm leading-7 text-cocoa/75">{p.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {p.badges.map((b) => (
                        <span key={b} className="rounded-full border border-cocoa/15 bg-ivory/60 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-cocoa/65">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="mb-6 space-y-2 border-t border-cocoa/12 pt-5 text-xs">
                      {[
                        ["Weight", "100g"],
                        ["Skin Types", "Dry · Oily · Combination · Sensitive"],
                        ["Price", "GH₵ 45.00"],
                        ["Origin", "Handcrafted in Ghana"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="uppercase tracking-[0.14em] text-cocoa/50">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/checkout"
                      className="inline-flex w-full items-center justify-center rounded-full border border-gold/45 bg-cocoa px-8 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold transition hover:bg-gold hover:text-cocoa"
                    >
                      Buy Now — GH₵ 45
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Promise banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3e281b] to-[#1a0d06] px-6 py-20 text-center text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,200,58,0.15),transparent_55%)]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-cormorant text-5xl italic">The Live Daily Promise</h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-ivory/75">
            Every bar is made in small batches, zero harsh chemicals, cruelty-free, and packaged to honour
            Ghanaian identity at home and worldwide.
          </p>
          <Link href="/heritage" className="mt-8 inline-flex rounded-full border border-gold/50 bg-gold/90 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa transition hover:bg-ivory">
            Learn Our Heritage
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
