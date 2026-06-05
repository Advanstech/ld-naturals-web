import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Heritage | Live Daily Naturals",
  description: "The roots of Live Daily Naturals — Ghanaian culture, craft, and botanical legacy.",
};

export default function HeritagePage() {
  return (
    <main className="relative bg-cocoa text-ivory">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <Image src="/hero-image.jpg" alt="Ghanaian Heritage" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3e281b]/75 to-[#1a0d06]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(216,200,58,0.2),transparent_36%)]" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold/80">Rooted in Ghana</p>
          <h1 className="font-cormorant text-6xl italic leading-[0.88] md:text-8xl">
            Culture.<br />
            <span className="text-gold">Craft.</span> Legacy.
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/80">
            Centuries of Ghanaian wisdom — from the Ashanti forest floor to the Volta basin — live inside every bar we make.
          </p>
        </div>
      </section>

      {/* Dual editorial */}
      <section className="bg-gradient-to-b from-[#1a0d06] to-[#3e281b] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <article className="overflow-hidden rounded-[2rem] border border-gold/20 bg-black/20 shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
              <div className="relative h-80 w-full">
                <Image src="/eco_indigenous_craft.png" alt="Ghanaian culture" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-8">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold/70">Roots</p>
                <h2 className="font-cormorant text-4xl">Indigenous Craft</h2>
                <p className="mt-4 text-sm leading-7 text-ivory/75">
                  Traditional African black soap has been crafted in Ghana for centuries using plantain ash, shea butter,
                  palm oil, and cocoa pods. Our process honours this knowledge with modern hygiene and precision.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-gold/20 bg-black/20 shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
              <div className="relative h-80 w-full">
                <Image src="/eco_bilingual_packaging.png" alt="Heritage packaging" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-8">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold/70">Identity</p>
                <h2 className="font-cormorant text-4xl">Bilingual Packaging</h2>
                <p className="mt-4 text-sm leading-7 text-ivory/75">
                  Our packaging bridges Ghanaian local identity and global elegance. English and Twi sit side by side —
                  because our heritage should be visible and celebrated, not hidden.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Ingredient story */}
      <section className="bg-[#2b1b12] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold/70">The Ingredients</p>
            <h2 className="font-cormorant text-5xl italic">What Goes Inside</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: "Raw Cocoa Butter", origin: "Ashanti Region, GH", desc: "Cold-pressed from Ghanaian cocoa pods. Rich in fatty acids that deeply nourish and protect melanin-rich skin." },
              { name: "African Black Soap", origin: "Traditional Craft", desc: "Made with plantain ash, palm kernel, and shea. Gently clarifies, exfoliates, and balances without stripping moisture." },
              { name: "Natural Botanicals", origin: "Volta & Brong-Ahafo", desc: "Seasonal aromatic botanicals sourced locally add therapeutic notes and additional antioxidant benefit." },
            ].map((ing) => (
              <div key={ing.name} className="rounded-[2rem] border border-gold/18 bg-black/25 p-7">
                <p className="mb-1 text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">{ing.origin}</p>
                <h3 className="mb-3 font-cormorant text-2xl">{ing.name}</h3>
                <p className="text-sm leading-relaxed text-ivory/70">{ing.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-[#1a0d06] to-cocoa px-6 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(216,200,58,0.14),transparent_60%)]" />
          <div className="relative">
            <h2 className="font-cormorant text-5xl italic">Wear the Legacy</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ivory/70">
              Every bar carries generations of craft. Choose yours and begin the ritual.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/products" className="rounded-full border border-gold/50 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa transition hover:bg-ivory">
                Shop the Collection
              </Link>
              <Link href="/about" className="rounded-full border border-ivory/35 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
