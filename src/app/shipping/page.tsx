import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shipping & Returns | Live Daily Naturals",
  description: "Information about shipping, delivery timelines, and our returns policy.",
};

export default function ShippingPage() {
  return (
    <main className="relative bg-ivory text-cocoa">
      <Navbar />
      
      <section className="relative overflow-hidden bg-cocoa px-6 py-40 text-center text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(216,200,58,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold/80">Our Policy</p>
          <h1 className="font-cormorant text-6xl italic md:text-8xl">Shipping & Returns</h1>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-16">
          <div>
            <h2 className="mb-6 font-cormorant text-4xl italic">Shipping Information</h2>
            <div className="space-y-6 text-sm leading-7 text-cocoa/80">
              <p>
                We handcraft our soaps in small batches in Accra, Ghana, to ensure maximum freshness and quality. All orders are processed and shipped within 1–3 business days.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[2rem] border border-cocoa/10 bg-white/50 p-8 shadow-sm">
                  <h3 className="mb-2 font-semibold uppercase tracking-widest text-terracotta text-xs">Domestic (Ghana)</h3>
                  <ul className="space-y-2 mt-4">
                    <li className="flex justify-between border-b border-cocoa/10 pb-2">
                      <span>Standard (2-3 days)</span>
                      <span>GH₵ 40.00</span>
                    </li>
                    <li className="flex justify-between border-b border-cocoa/10 pb-2">
                      <span>Express (Next day)</span>
                      <span>GH₵ 70.00</span>
                    </li>
                    <li className="flex justify-between pt-2">
                      <span>Free shipping over</span>
                      <span>GH₵ 250.00</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-[2rem] border border-cocoa/10 bg-white/50 p-8 shadow-sm">
                  <h3 className="mb-2 font-semibold uppercase tracking-widest text-terracotta text-xs">International</h3>
                  <ul className="space-y-2 mt-4">
                    <li className="flex justify-between border-b border-cocoa/10 pb-2">
                      <span>US/Canada (5-7 days)</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex justify-between border-b border-cocoa/10 pb-2">
                      <span>Europe (5-10 days)</span>
                      <span>€20.00</span>
                    </li>
                    <li className="flex justify-between pt-2">
                      <span>Rest of World</span>
                      <span>Calculated at checkout</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-cormorant text-4xl italic">Returns & Exchanges</h2>
            <div className="space-y-4 text-sm leading-7 text-cocoa/80">
              <p>
                Due to the personal nature of our skincare products, we cannot accept returns or exchanges on opened or used soaps. However, your satisfaction is our highest priority.
              </p>
              <p>
                If your order arrives damaged or you receive the incorrect item, please contact us within 7 days of delivery at <a href="mailto:hello@livedailynaturals.com" className="text-terracotta hover:text-cocoa underline underline-offset-4">hello@livedailynaturals.com</a> with your order number and photos of the issue. We will gladly send a replacement or issue a refund.
              </p>
              <p>
                Unopened, unused products in their original packaging can be returned within 14 days of delivery. The customer is responsible for return shipping costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
