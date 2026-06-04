"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const storyCards = [
  {
    title: "Soil",
    subtitle: "Timeless Ghanaian Icons",
    body: "From Ashanti earth to Volta sunlight, our ingredients begin in living soil and ancestral craft.",
    image: "/brand-soil.svg",
  },
  {
    title: "Skin",
    subtitle: "Artisanal Bath & Body",
    body: "Hand-cut, cured, and wrapped in small batches to protect nutrients and performance on melanin-rich skin.",
    image: "/brand-skin.svg",
  },
  {
    title: "Soul",
    subtitle: "Mindful Daily Ritual",
    body: "Every bar is a moment of pause: cleanse, breathe, reset. A ritual rooted in heritage and modern wellness.",
    image: "/brand-soul.svg",
  },
];

export default function OurStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".story-heading", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.utils.toArray<HTMLElement>(".story-card").forEach((card, idx) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
          delay: idx * 0.08,
        });
      });

      gsap.to(".story-pin-title", {
        letterSpacing: "0.25em",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom center",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#e6dcc3] px-6 py-28 text-cocoa">
      <div className="mx-auto max-w-6xl">
        <div className="story-heading mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-terracotta">Our Story</p>
          <h2 className="story-pin-title font-cormorant text-5xl italic md:text-6xl">Soil • Skin • Soul</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {storyCards.map((card) => (
            <article key={card.title} className="story-card group overflow-hidden rounded-[2rem] border border-cocoa/15 bg-ivory/90 shadow-[0_24px_70px_rgba(62,40,27,0.1)]">
              <div className="relative h-64 w-full overflow-hidden">
                <Image src={card.image} alt={card.subtitle} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/10 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full border border-gold/40 bg-cocoa/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold backdrop-blur-md">
                  {card.title}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-cormorant text-4xl leading-none">{card.title}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-terracotta">{card.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-cocoa/80">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
