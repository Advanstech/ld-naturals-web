"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

const PRODUCTS: Record<string, {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  details: string[];
  sku: string;
  inStock: boolean;
  badge: string;
  accentColor: string;
}> = {
  "cocoa-black-soap-scented": {
    id: "scented",
    slug: "cocoa-black-soap-scented",
    name: "Cocoa Butter Black Soap",
    subtitle: "Signature Scented",
    price: 45,
    image: "/product-scented.jpeg",
    images: ["/product-scented.jpeg", "/product-unscented.jpeg"],
    description:
      "Infused with natural botanical aromatic notes for a luxurious daily cleansing ritual. Rich Ghanaian cocoa butter cushions the skin, leaving it smooth, luminous, and deeply nourished.",
    details: [
      "100% natural ingredients",
      "Traditional African black soap base",
      "Raw Ghanaian cocoa butter",
      "Aromatic botanical essences",
      "100g artisan bar",
    ],
    sku: "LDN-CBBS-SC-100",
    inStock: true,
    badge: "Aromatic Ritual",
    accentColor: "#b8865f",
  },
  "cocoa-black-soap-unscented": {
    id: "unscented",
    slug: "cocoa-black-soap-unscented",
    name: "Cocoa Butter Black Soap",
    subtitle: "Fragrance-Free",
    price: 45,
    image: "/product-unscented.jpeg",
    images: ["/product-unscented.jpeg", "/product-scented.jpeg"],
    description:
      "A gentle, fragrance-free daily bar designed for sensitive and melanin-rich skin. Maintains moisture barrier health while the traditional black soap base clarifies and exfoliates.",
    details: [
      "100% natural ingredients",
      "Traditional African black soap base",
      "Raw Ghanaian cocoa butter",
      "No added fragrance or essential oils",
      "100g artisan bar",
    ],
    sku: "LDN-CBBS-UN-100",
    inStock: true,
    badge: "Pure Calm",
    accentColor: "#8b552f",
  },
};

const ALIASES: Record<string, string> = {
  scented: "cocoa-black-soap-scented",
  unscented: "cocoa-black-soap-unscented",
  "cocoa-butter-black-soap-scented": "cocoa-black-soap-scented",
  "cocoa-butter-black-soap-unscented": "cocoa-black-soap-unscented",
};

export default function ProductDetailedPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const rawSlug = typeof params.slug === "string" ? params.slug : "";
  const resolvedSlug = ALIASES[rawSlug] || rawSlug;
  const product = PRODUCTS[resolvedSlug];

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(product?.image || "");

  if (!product) {
    return (
      <main className="relative flex min-h-screen flex-col bg-ivory text-cocoa">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-36 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-terracotta">404</p>
          <h2 className="font-cormorant text-5xl italic md:text-6xl">Product Not Found</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-cocoa/60">
            We couldn&apos;t find a product at <span className="font-semibold">/products/{rawSlug}</span>. It may not exist or has been removed.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full border border-cocoa/30 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa transition hover:bg-cocoa hover:text-ivory"
          >
            Back to Collection
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: `${product.name} — ${product.subtitle}`,
      price: product.price,
      quantity,
      imageUrl: activeImage,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-ivory text-cocoa">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-28 md:py-36">
        <Link
          href="/products"
          className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cocoa/60 transition hover:text-terracotta"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-5">
            <div
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-cocoa/10 bg-[#e9dfc2] shadow-[0_30px_80px_rgba(62,40,27,0.12)]"
              style={{ backgroundColor: product.accentColor + "15" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.45),transparent_65%)]" />
              <Image
                src={activeImage}
                alt={`${product.name} — ${product.subtitle}`}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute left-5 top-5 rounded-full border border-gold/45 bg-cocoa/55 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md">
                {product.badge}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                      activeImage === img
                        ? "border-terracotta shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100 hover:border-cocoa/20"
                    }`}
                  >
                    <Image src={img} alt="Product thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-terracotta">
              {product.subtitle}
            </p>
            <h1 className="mt-2 font-cormorant text-5xl italic leading-tight md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 text-2xl font-medium text-cocoa/80">GH₵ {product.price.toFixed(2)}</p>
            <p className="mt-6 text-sm leading-7 text-cocoa/75">{product.description}</p>

            <ul className="mt-6 space-y-2">
              {product.details.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-cocoa/70">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
                  {d}
                </li>
              ))}
            </ul>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-6">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cocoa/60">Quantity</span>
              <div className="flex items-center gap-4 rounded-full border border-cocoa/20 px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 text-cocoa/60 transition hover:text-terracotta"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 text-cocoa/60 transition hover:text-terracotta"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-cocoa bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-cocoa transition hover:bg-cocoa/5"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center rounded-full bg-cocoa px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ivory shadow-lg transition hover:bg-terracotta hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Meta */}
            <div className="mt-10 space-y-3 border-t border-cocoa/10 pt-8 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-[0.16em] text-cocoa/55">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-[0.16em] text-cocoa/55">Availability</span>
                <span className="font-medium">{product.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-[0.16em] text-cocoa/55">Weight</span>
                <span className="font-medium">100g</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
