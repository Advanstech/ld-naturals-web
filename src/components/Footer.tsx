import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#2b1b12] px-6 pb-12 pt-20 text-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,200,58,0.18),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(184,134,95,0.2),transparent_35%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 grid grid-cols-1 gap-10 border-b border-gold/20 pb-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-gold/80">Live Daily</p>
            <h2 className="font-cormorant text-5xl italic leading-none">Nourish Daily</h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/75">
              Premium natural soap rituals rooted in Ghanaian heritage — crafted for glow, softness, and skin resilience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm lg:col-span-1">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h3>
              <ul className="space-y-3 text-ivory/75">
                <li><Link href="/" className="transition hover:text-gold">Home</Link></li>
                <li><Link href="/quiz" className="transition hover:text-gold">AI Skin Quiz</Link></li>
                <li><Link href="/checkout" className="transition hover:text-gold">Checkout</Link></li>
                <li><Link href="/about" className="transition hover:text-gold">Our Story</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Support</h3>
              <ul className="space-y-3 text-ivory/75">
                <li><Link href="/shipping" className="transition hover:text-gold">Shipping & Returns</Link></li>
                <li><Link href="/wholesale" className="transition hover:text-gold">Wholesale</Link></li>
                <li><Link href="/contact" className="transition hover:text-gold">Contact</Link></li>
                <li><Link href="/faq" className="transition hover:text-gold">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Join The Ritual</h3>
            <p className="mb-4 text-sm text-ivory/75">Get launch drops, ritual tips, and Ghanaian wellness stories.</p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="w-full border border-ivory/20 bg-black/20 px-4 py-3 text-sm text-ivory placeholder:text-ivory/50 outline-none transition focus:border-gold"
              />
              <button
                type="button"
                className="border border-gold/60 bg-gold/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cocoa transition hover:bg-ivory"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-ivory/55 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Live Daily Naturals. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-gold">Instagram</a>
            <a href="#" className="transition hover:text-gold">TikTok</a>
            <a href="#" className="transition hover:text-gold">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
