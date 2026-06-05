"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: "cocoa-black-soap-scented",
    slug: "cocoa-black-soap-scented",
    label: "Signature Scented",
    tag: "Aromatic Ritual • 100g",
    name: "Cocoa Butter",
    nameSub: "Black Soap",
    accent: "Radiance & Aroma",
    description:
      "Infused with natural botanical aromatic notes for a luxurious daily cleansing ritual. Rich Ghanaian cocoa butter cushions the skin, leaving it smooth, luminous, and deeply nourished.",
    badges: ["Aromatic", "Glow-Boosting", "Hydrating"],
    image: "/product-scented.jpeg",
    bg: "#f4ecd8",
    statColor: "text-terracotta",
    price: 120,
  },
  {
    id: "cocoa-black-soap-unscented",
    slug: "cocoa-black-soap-unscented",
    label: "Fragrance-Free",
    tag: "Pure Calm • 100g",
    name: "Cocoa Butter",
    nameSub: "Black Soap",
    accent: "Pure Calm & Care",
    description:
      "A gentle, fragrance-free daily bar designed for sensitive and melanin-rich skin. Maintains moisture barrier health while the traditional black soap base clarifies and exfoliates.",
    badges: ["Sensitive-Safe", "Clarifying", "Barrier-Care"],
    image: "/product-unscented.jpeg",
    bg: "#e9dfc2",
    statColor: "text-[#8b552f]",
    price: 120,
  },
];

const stats = [
  { value: "100%", label: "Natural" },
  { value: "0%", label: "Chemicals" },
  { value: "24h", label: "Hydration" },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleBuyNow = (p: typeof products[0]) => {
    addToCart({
      id: p.id,
      slug: p.slug,
      name: `${p.name} ${p.nameSub} (${p.label})`,
      price: p.price,
      quantity: 1,
      imageUrl: p.image
    });
    router.push("/checkout");
  };

  const handleAddToCart = (p: typeof products[0]) => {
    addToCart({
      id: p.id,
      slug: p.slug,
      name: `${p.name} ${p.nameSub} (${p.label})`,
      price: p.price,
      quantity: 1,
      imageUrl: p.image
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ps-heading", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.utils.toArray<HTMLElement>(".ps-card").forEach((card, i) => {
        gsap.from(card, {
          x: i === 0 ? -80 : 80,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".ps-img").forEach((img) => {
        gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.from(".ps-stat", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ps-stats", start: "top 88%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative overflow-hidden bg-ivory px-6 py-28 text-cocoa"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(216,200,58,0.16),transparent_32%),radial-gradient(circle_at_92%_88%,rgba(184,134,95,0.2),transparent_36%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="ps-heading mb-16 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-terracotta">Our Products</p>
          <h2 className="font-cormorant text-5xl italic md:text-7xl">
            The Ritual Pair
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cocoa/65">
            Two expressions of the same daily ritual — both handcrafted from Ghanaian cocoa butter, both designed to cleanse, nourish, and glow.
          </p>
        </div>

        {/* Shared stats banner */}
        <div className="ps-stats mb-14 grid grid-cols-3 divide-x divide-cocoa/10 rounded-2xl border border-cocoa/10 bg-[#f0e7d2]/70 py-6 backdrop-blur-sm">
          {stats.map((s) => (
            <div key={s.label} className="ps-stat px-6 text-center">
              <div className="font-cormorant text-4xl">{s.value}</div>
              <div className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-cocoa/60">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dual product cards */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {products.map((p) => (
            <article
              key={p.id}
              className="ps-card group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-cocoa/12 shadow-[0_40px_100px_rgba(62,40,27,0.13)]"
              style={{ background: p.bg }}
            >
              {/* Subtle radial glow */}
              <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.6),transparent_60%)]" />

              {/* Product image */}
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                <div className="ps-img absolute inset-0 h-[115%] w-full">
                  <Image
                    src={p.image}
                    alt={`${p.name} ${p.nameSub} — ${p.label}`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                {/* Variant pill */}
                <div className="absolute left-6 top-6 rounded-full border border-gold/45 bg-cocoa/55 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md">
                  {p.label}
                </div>
              </div>

              {/* Info panel */}
              <div className="relative z-10 flex flex-1 flex-col justify-between p-8 md:p-10">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cocoa/55">{p.tag}</p>
                  <h3 className="mt-3 font-cormorant text-4xl leading-tight md:text-5xl lg:text-5xl xl:text-6xl">
                    {p.name}
                    <br />
                    <span className={`italic ${p.statColor}`}>{p.nameSub}</span>
                  </h3>
                  <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.16em] ${p.statColor}`}>
                    {p.accent}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-cocoa/75">{p.description}</p>

                  {/* Badge pills */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-cocoa/18 bg-ivory/60 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cocoa/70 shadow-sm"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specs + CTA */}
                <div className="mt-10">
                  <div className="mb-6 space-y-3 border-t border-cocoa/12 pt-6 text-xs">
                    {[
                      ["Weight", "100g"],
                      ["Skin Types", "Dry · Oily · Combination · Sensitive"],
                      ["Price", "GH₵ 120.00"],
                      ["Origin", "Handcrafted in Ghana"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="uppercase tracking-[0.14em] text-cocoa/50">{k}</span>
                        <span className="font-semibold text-cocoa/90">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex-1 rounded-full border border-cocoa/30 px-4 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cocoa transition hover:border-cocoa hover:bg-cocoa/5"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(p)}
                      className="flex-1 rounded-full border border-gold/45 bg-cocoa px-4 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold shadow-[0_12px_40px_rgba(62,40,27,0.22)] transition hover:bg-gold hover:text-cocoa"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-full border border-cocoa/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa/70 transition hover:border-cocoa hover:text-cocoa"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
