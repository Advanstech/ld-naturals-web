import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Rituals | Live Daily Naturals",
  description: "Discover the Live Daily cleansing ritual — a mindful daily practice rooted in Ghanaian heritage.",
};

const steps = [
  {
    num: "01",
    title: "Wet Your Skin",
    body: "Begin with warm water to open pores and soften skin. This prepares your skin to receive the full benefits of the cocoa butter black soap.",
  },
  {
    num: "02",
    title: "Lather the Bar",
    body: "Work the soap into a rich, creamy lather in your palms or on a soft washcloth. A little goes a long way.",
  },
  {
    num: "03",
    title: "Cleanse & Massage",
    body: "Apply to skin in gentle circular motions for 30–60 seconds. Let the black soap base clarify while cocoa butter nourishes.",
  },
  {
    num: "04",
    title: "Rinse & Glow",
    body: "Rinse with cool or lukewarm water to seal skin. Pat dry and follow with your preferred moisturiser or raw shea butter.",
  },
];

export default function RitualsPage() {
  return (
    <main className="relative bg-ivory text-cocoa">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[65vh] overflow-hidden bg-cocoa">
        <Image src="/hero-image.jpg" alt="The Daily Ritual" fill className="object-cover opacity-35" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3e281b]/80 to-[#1a0d06]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(216,200,58,0.2),transparent_35%)]" />
        <div className="relative z-10 mx-auto flex min-h-[65vh] max-w-4xl flex-col items-center justify-center px-6 text-center text-ivory">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold/80">The Practice</p>
          <h1 className="font-cormorant text-6xl italic leading-[0.88] md:text-8xl">
            The Daily <span className="text-gold">Ritual</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/80">
            More than a cleanse — a daily ceremony for your skin and your spirit. Rooted in Ghanaian tradition, designed for modern living.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#e6dcc3] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-terracotta">How to Use</p>
            <h2 className="font-cormorant text-5xl italic">The Four Steps</h2>
          </div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`flex flex-col gap-6 md:flex-row md:items-start ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-cocoa/10 font-cormorant text-3xl italic text-cocoa/50 md:self-start">
                  {s.num}
                </div>
                <div className="rounded-[2rem] border border-cocoa/12 bg-ivory/90 p-8 shadow-[0_20px_60px_rgba(62,40,27,0.08)] md:flex-1">
                  <h3 className="mb-3 font-cormorant text-3xl">{s.title}</h3>
                  <p className="text-sm leading-7 text-cocoa/75">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product tie-in */}
      <section className="bg-ivory px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-terracotta">The Ritual Bar</p>
            <h2 className="font-cormorant text-5xl italic">Choose Your Expression</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { label: "Signature Scented", image: "/product-scented.jpeg", desc: "Aromatic notes for an elevated morning ritual that awakens the senses.", bg: "#f4ecd8" },
              { label: "Fragrance-Free", image: "/product-unscented.jpeg", desc: "Gentle, unscented care for sensitive skin and evening wind-down rituals.", bg: "#e9dfc2" },
            ].map((p) => (
              <article
                key={p.label}
                className="group overflow-hidden rounded-[2rem] border border-cocoa/12 shadow-[0_30px_80px_rgba(62,40,27,0.1)]"
                style={{ background: p.bg }}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={p.image} alt={p.label} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute left-5 top-5 rounded-full border border-gold/45 bg-cocoa/55 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md">
                    {p.label}
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-sm leading-relaxed text-cocoa/75">{p.desc}</p>
                  <Link
                    href="/checkout"
                    className="mt-5 inline-flex rounded-full border border-gold/45 bg-cocoa px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-cocoa"
                  >
                    Buy Now — GH₵ 120
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
