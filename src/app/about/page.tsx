import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us | Live Daily Naturals",
  description: "The story of Live Daily Naturals — crafted in Ghana, designed for everyday ritual.",
};

export default function AboutPage() {
  return (
    <main className="relative bg-ivory text-cocoa">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden bg-cocoa">
        <Image
          src="/hero-image.jpg"
          alt="About Live Daily Naturals"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3e281b]/70 to-[#1a0d06]/95" />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center text-ivory">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold/80">Our Story</p>
          <h1 className="font-cormorant text-6xl italic leading-[0.88] md:text-8xl">
            Born from the <br />
            <span className="text-gold">Soil of Ghana</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/80">
            Live Daily Naturals is a premium Ghanaian skincare brand rooted in ancestral
            cleansing traditions and crafted for the modern ritual.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#f0e7d2] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-terracotta">Our Mission</p>
              <h2 className="font-cormorant text-5xl italic leading-tight">
                Nourish Daily<br />with Nature&apos;s Touch
              </h2>
              <p className="mt-5 text-sm leading-7 text-cocoa/75">
                We set out to make the best of Ghanaian botanical heritage accessible every day — not as a luxury
                exception, but as a joyful daily ritual. Every bar we make is handcrafted in small batches with
                raw cocoa butter, traditional black soap, and zero harmful chemicals.
              </p>
              <p className="mt-4 text-sm leading-7 text-cocoa/75">
                Our founder grew up witnessing the power of cocoa butter on melanin-rich skin — and knew the world
                needed this, packaged with the pride and elegance Ghana deserves.
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-[2rem] border border-cocoa/12">
              <Image src="/brand-soil.svg" alt="Ghanaian botanical heritage" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-terracotta">What Drives Us</p>
            <h2 className="font-cormorant text-5xl italic">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Heritage First",
                body: "Every formulation honours the craft passed down through Ghanaian generations — nothing is wasted, nothing is rushed.",
                icon: "🌿",
              },
              {
                title: "Skin Transparency",
                body: "100% natural, 0% hidden chemicals. Every ingredient earns its place with a clear purpose and proven skin benefit.",
                icon: "✨",
              },
              {
                title: "Everyday Luxury",
                body: "Premium should not be rare. We believe in daily rituals that feel indulgent, intentional, and deeply nourishing.",
                icon: "🫧",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-[2rem] border border-cocoa/12 bg-[#f4ecd8]/80 p-8 shadow-[0_24px_60px_rgba(62,40,27,0.08)]">
                <div className="mb-4 text-3xl">{v.icon}</div>
                <h3 className="mb-2 font-cormorant text-3xl">{v.title}</h3>
                <p className="text-sm leading-relaxed text-cocoa/75">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#3e281b] to-[#1a0d06] px-6 py-24 text-center text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,200,58,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-cormorant text-5xl italic md:text-6xl">Start Your Ritual</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-ivory/75">
            Experience the difference of Ghanaian cocoa butter daily cleansing.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/products" className="rounded-full border border-gold/50 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa transition hover:bg-ivory">
              Shop Now
            </Link>
            <Link href="/heritage" className="rounded-full border border-ivory/35 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:border-gold hover:text-gold">
              Our Heritage
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
