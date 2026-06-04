import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OurStorySection from "@/components/OurStorySection";
import EcoLuxurySection from "@/components/EcoLuxurySection";
import GhanaStorySection from "@/components/GhanaStorySection";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ProductShowcase />
      <OurStorySection />
      <EcoLuxurySection />
      <GhanaStorySection />
      <Footer />
    </main>
  );
}
