'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Loader2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailedPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchApi(`/products/${slug}`);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          // Sort to put primary image first
          const sortedImages = [...data.images].sort((a: any, b: any) => 
            (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)
          );
          setActiveImage(sortedImages[0].url);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: activeImage || '/placeholder.png' // Use the primary image
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-ivory text-cocoa flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-terracotta" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-ivory text-cocoa flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-4xl font-cormorant italic mb-4">Product Not Found</h2>
          <p className="text-cocoa/60 mb-8 max-w-md">{error || 'The product you are looking for does not exist or has been removed.'}</p>
          <Link href="/products" className="rounded-full border border-cocoa/30 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa transition hover:bg-cocoa hover:text-ivory">
            Back to Collection
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const images = product.images && product.images.length > 0 
    ? [...product.images].sort((a: any, b: any) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    : [];

  return (
    <main className="bg-ivory text-cocoa min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-24 md:py-32">
        <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cocoa/60 hover:text-terracotta transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-cocoa/5 shadow-lg border border-cocoa/10 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]" />
              {activeImage ? (
                <Image 
                  src={activeImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cocoa/30">No Image Available</div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: any, idx: number) => (
                  <button 
                    key={img.id || idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === img.url ? 'border-terracotta shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:border-cocoa/20'
                    }`}
                  >
                    <Image src={img.url} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-terracotta mb-4">
              {product.category?.name || 'Live Daily Naturals'}
            </p>
            
            <h1 className="font-cormorant text-5xl md:text-6xl italic leading-tight mb-2">
              {product.name}
            </h1>
            
            <p className="text-xl font-medium text-cocoa/80 mb-6">GH₵ {product.price.toFixed(2)}</p>
            
            <div className="prose prose-sm prose-cocoa max-w-none text-cocoa/80 mb-8">
              <p className="leading-relaxed">{product.description}</p>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cocoa/60">Quantity</span>
                <div className="flex items-center border border-cocoa/20 rounded-full px-4 py-2">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 text-cocoa/60 hover:text-terracotta transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1 text-cocoa/60 hover:text-terracotta transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-cocoa px-8 py-4 text-xs font-bold uppercase tracking-widest text-cocoa transition hover:bg-cocoa/5"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-cocoa px-8 py-4 text-xs font-bold uppercase tracking-widest text-ivory shadow-lg hover:bg-terracotta hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Buy Now
              </button>
            </div>
            
            <div className="pt-8 border-t border-cocoa/10 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-widest text-cocoa/60">SKU</span>
                <span className="font-medium text-cocoa">{product.sku}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-widest text-cocoa/60">Availability</span>
                <span className="font-medium text-cocoa">
                  {product.inventory?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
