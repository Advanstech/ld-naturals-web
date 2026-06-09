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
    badges: ["Aromatic", "Glow-Boosting", "Hydrating", "All Skin Types"],
    image: "/scented-box.jpeg",
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
  {
    id: "carrot-oil-black-soap",
    slug: "carrot-oil-black-soap",
    label: "Carrot Oil",
    tag: "Nourish Daily • 100g",
    name: "Carrot Oil",
    nameSub: "Black Soap",
    accent: "Nature's Touch",
    description:
      "Rich with natural carrot oil to nourish your skin daily. Packed with antioxidants, this soap naturally exfoliates, moisturizes, and leaves your skin glowing with an unmistakable vitality.",
    badges: ["Exfoliates", "Moisturizes", "Glow-Boosting", "All Skin Types"],
    image: "/new-carrot-oil.jpg",
    bg: "#f6e4cc",
    statColor: "text-[#c2611a]",
    price: 130,
  },
  {
    id: "customized-labelled-black-soap",
    slug: "customized-labelled-black-soap",
    label: "Customized Labelled",
    tag: "Your Brand • 100g",
    name: "Sharon Carrot",
    nameSub: "Oil Black Soap",
    accent: "White Label Example",
    description:
      "An example of our personalized soap service! This is a premium Ghanaian cocoa butter black soap infused with carrot oil, complete with custom Sharon branding. Perfect for gifting, special events, or starting your own brand.",
    badges: ["Customizable", "Carrot Oil", "White Label"],
    image: "/sharon-carrot-oil.jpg",
    bg: "#f3c7b6",
    statColor: "text-[#d1583b]",
    price: 150,
  },
];

const stats = [
  { value: "100%", label: "Natural" },
  { value: "0%", label: "Chemicals" },
  { value: "24h", label: "Hydration" },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
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
    // Only run on desktop/tablet to avoid weird mobile scroll issues if preferred, 
    // but GSAP ScrollTrigger handles responsive well.
    const ctx = gsap.context(() => {
      // Intro fade up
      gsap.from(".ps-heading", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
      
      gsap.from(".ps-stat", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ps-stats", start: "top 88%" },
      });

      const track = trackRef.current;
      if (track) {
        // We use a matchMedia so the horizontal scroll only happens on md+ screens
        ScrollTrigger.matchMedia({
          "(min-width: 768px)": function () {
            const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
            
            const tween = gsap.to(track, {
              x: getScrollAmount,
              ease: "none",
              scrollTrigger: {
                trigger: ".ps-scroll-container",
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 1.2,
                invalidateOnRefresh: true,
              }
            });

            // Progress bar animation
            gsap.to(".ps-progress-bar", {
              width: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: ".ps-scroll-container",
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                scrub: true,
              }
            });

            // Parallax image within the horizontally scrolling container
            gsap.utils.toArray<HTMLElement>(".ps-img").forEach((img) => {
              gsap.to(img, {
                xPercent: 12, // Move right subtly as it scrolls left
                ease: "none",
                scrollTrigger: {
                  trigger: img.closest('.ps-card'),
                  containerAnimation: tween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              });
            });

            // Focus scaling and background morphing for each card
            const cards = gsap.utils.toArray<HTMLElement>(".ps-card");
            cards.forEach((card, idx) => {
              const bg = products[idx].bg;
              
              // Scale and opacity focus transition
              gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween,
                  start: "left 85%",
                  end: "right 15%",
                  scrub: true,
                }
              })
              .fromTo(card, 
                { scale: 0.92, opacity: 0.7 },
                { scale: 1.04, opacity: 1, ease: "sine.out", duration: 0.5 }
              )
              .to(card, 
                { scale: 0.92, opacity: 0.7, ease: "sine.in", duration: 0.5 }
              );

              // Background color morphing based on active card
              ScrollTrigger.create({
                trigger: card,
                containerAnimation: tween,
                start: "left 60%",
                end: "right 40%",
                onToggle: (self) => {
                  if (self.isActive && sectionRef.current) {
                    gsap.to(sectionRef.current, {
                      backgroundColor: bg,
                      duration: 0.8,
                      ease: "power2.out",
                      overwrite: "auto"
                    });
                  }
                }
              });
            });
            
            return () => {
              tween.kill();
            }
          },
          // Mobile animation (vertical standard scroll)
          "(max-width: 767px)": function () {
             gsap.utils.toArray<HTMLElement>(".ps-card").forEach((card, i) => {
                gsap.from(card, {
                  y: 50,
                  opacity: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                  }
                });
             });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative overflow-hidden bg-ivory text-cocoa"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(216,200,58,0.16),transparent_32%),radial-gradient(circle_at_92%_88%,rgba(184,134,95,0.2),transparent_36%)] pointer-events-none" />

      {/* Header Section */}
      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-10">
        <div className="ps-heading text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-terracotta">Our Products</p>
          <h2 className="font-cormorant text-5xl italic md:text-7xl">
            The Ritual Collection
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-cocoa/65">
            Four expressions of our daily cleansing ritual — handcrafted from Ghanaian cocoa butter and nature's finest ingredients, designed to nourish, glow, and tell your story.
          </p>
        </div>

        <div className="ps-stats mt-14 grid grid-cols-3 divide-x divide-cocoa/10 rounded-2xl border border-cocoa/10 bg-[#f0e7d2]/70 py-6 backdrop-blur-sm max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="ps-stat px-6 text-center">
              <div className="font-cormorant text-4xl">{s.value}</div>
              <div className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-cocoa/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="ps-scroll-container w-full md:h-screen flex items-center relative z-10 py-10 md:py-0">
        <div 
          ref={trackRef} 
          className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 md:px-[10vw] w-full md:w-max items-center h-full"
        >
          {products.map((p) => (
            <article
              key={p.id}
              className="ps-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-cocoa/12 shadow-[0_30px_70px_rgba(62,40,27,0.08)] w-full md:w-[40vw] lg:w-[28vw] md:h-[75vh] shrink-0"
              style={{ background: p.bg }}
            >
              {/* Subtle radial glow */}
              <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.6),transparent_60%)]" />

              {/* Product image */}
              <div className="relative h-64 md:flex-1 w-full shrink-0 overflow-hidden min-h-[40vh]">
                <Link href={`/products/${p.slug}`} className="absolute inset-0 h-full w-full block">
                  <div className="ps-img w-full h-full relative origin-center">
                    <Image
                      src={p.image}
                      alt={`${p.name} ${p.nameSub} — ${p.label}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </Link>
                {/* Variant pill */}
                <div className="absolute left-5 top-5 rounded-full border border-gold/45 bg-cocoa/55 px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md z-10">
                  {p.label}
                </div>
              </div>

              {/* Info panel */}
              <div className="relative z-10 flex shrink-0 flex-col justify-between p-6 bg-white/40 backdrop-blur-md border-t border-white/20">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[0.6rem] uppercase tracking-[0.28em] text-cocoa/55">{p.tag}</p>
                    <p className="font-cormorant text-lg font-bold text-cocoa/80">GH¢ {p.price}.00</p>
                  </div>
                  <h3 className="mt-2 font-cormorant text-3xl leading-tight">
                    <Link href={`/products/${p.slug}`} className="hover:opacity-80 transition-opacity">
                      {p.name} <span className={`italic ${p.statColor}`}>{p.nameSub}</span>
                    </Link>
                  </h3>
                  <p className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] ${p.statColor}`}>
                    {p.accent}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-cocoa/75 line-clamp-2">{p.description}</p>
                </div>

                {/* Specs + CTA */}
                <div className="mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex-1 rounded-full border border-cocoa/30 px-3 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-cocoa transition hover:border-cocoa hover:bg-cocoa/5"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(p)}
                      className="flex-1 rounded-full border border-gold/45 bg-cocoa px-3 py-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold shadow-lg transition hover:bg-gold hover:text-cocoa"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Sleek Horizontal Progress Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-72 h-[3px] bg-cocoa/10 rounded-full overflow-hidden hidden md:block z-30">
          <div className="ps-progress-bar h-full bg-gold rounded-full w-0" />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 mb-28 text-center relative z-10">
        <Link
          href="/products"
          className="inline-flex rounded-full border border-cocoa/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa/70 transition hover:border-cocoa hover:text-cocoa"
        >
          View Full Collection
        </Link>
      </div>
    </section>
  );
}
