"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function GhanaStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ghana-reveal", {
        y: 70,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-[#3e281b] to-[#1f130d] px-6 py-24 text-ivory">
      <div className="mx-auto max-w-6xl">
        <div className="ghana-reveal mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold/80">Rooted in Ghanaian Storytelling</p>
          <h2 className="font-cormorant text-5xl italic md:text-6xl">Culture. Craft. Legacy.</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="ghana-reveal overflow-hidden border border-gold/25 bg-black/15">
            <div className="relative h-72 w-full">
              <Image src="/brand-culture.svg" alt="Culture and craft" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="font-cormorant text-4xl">Culture & Craft</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                Inspired by indigenous Ghanaian cleansing traditions and modern skin science, every bar is designed to respect skin and earth.
              </p>
            </div>
          </article>

          <article className="ghana-reveal overflow-hidden border border-gold/25 bg-black/15">
            <div className="relative h-72 w-full">
              <Image src="/brand-packaging.svg" alt="Packaging and identity" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="font-cormorant text-4xl">Bilingual Heritage Packaging</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                Our visual language bridges local authenticity and global elegance, so Ghanaian identity remains visible in every ritual.
              </p>
            </div>
          </article>
        </div>

        <div className="ghana-reveal mt-10 text-center">
          <Link href="/quiz" className="inline-flex rounded-sm border border-gold/50 bg-gold/90 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa transition hover:bg-ivory">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
