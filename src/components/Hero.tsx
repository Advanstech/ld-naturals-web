"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(badgeRef.current, { y: -30, opacity: 0, duration: 0.9, ease: "power3.out" })
        .from(titleRef.current, { y: 50, opacity: 0, duration: 1.1, ease: "power4.out" }, "-=0.4")
        .from(subRef.current, { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
        .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-cocoa">
      <div ref={imageRef} className="absolute inset-0 h-[120%] -top-[10%] w-full">
        <Image src="/hero-image.jpg" alt="Nature ritual background" fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(216,200,58,0.22),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(184,134,95,0.3),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-[#3e281b]/45 to-[#1a0d06]/90" />


      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-36 text-center text-ivory">
        <div ref={badgeRef} className="mb-6 rounded-full border border-gold/40 bg-cocoa/50 px-6 py-2 text-xs uppercase tracking-[0.35em] shadow-2xl shadow-black/20 backdrop-blur-md">
          Live Daily Naturals • Ghana
        </div>

        <h1 ref={titleRef} className="max-w-5xl font-cormorant text-6xl italic leading-[0.85] md:text-8xl lg:text-[8.5rem]">
          Nourish Daily
          <br />
          <span className="text-gold">with Nature&apos;s Touch</span>
        </h1>

        <p ref={subRef} className="mt-7 max-w-2xl text-sm leading-7 text-ivory/85 md:text-base">
          Premium cocoa butter black soap rituals crafted from Ghanaian heritage for soft, clear, radiant everyday skin.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/checkout" className="rounded-full border border-gold/50 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa shadow-[0_20px_60px_rgba(216,200,58,0.22)] transition hover:bg-ivory">
            Shop The Ritual
          </Link>
          <Link href="/quiz" className="rounded-full border border-ivory/45 bg-ivory/10 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory backdrop-blur-sm transition hover:border-gold hover:text-gold">
            Take AI Skin Quiz
          </Link>
        </div>

        <div className="mt-14 grid w-full max-w-3xl grid-cols-3 gap-3 text-left text-ivory/80">
          {["100% Natural", "Cocoa Butter Rich", "Made for Daily Glow"].map((item) => (
            <div key={item} className="rounded-2xl border border-ivory/15 bg-cocoa/35 p-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
