'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Plus, Pencil, Trash2, QrCode, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  inventory?: {
    quantity: number;
  };
  isActive: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrProduct, setQrProduct] = useState<Product | null>(null);
  const [downloadingQr, setDownloadingQr] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchApi('/products');
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleDownloadQr = async () => {
    if (!qrProduct) return;
    setDownloadingQr(true);
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`https://ldnaturals.com/verify/${qrProduct.slug}`)}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${qrProduct.slug}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Failed to download QR code. Please try again.");
    } finally {
      setDownloadingQr(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-terracotta border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-cormorant font-bold text-cocoa">Products</h1>
          <p className="mt-2 text-sm text-cocoa/60">
            A list of all products in your store including their name, SKU, price, and inventory status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center rounded-xl bg-cocoa px-5 py-2.5 text-sm font-bold text-ivory shadow-sm hover:bg-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta uppercase tracking-widest transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-cocoa/5 rounded-3xl bg-white">
              <table className="min-w-full divide-y divide-cocoa/5">
                <thead className="bg-cocoa/[0.02]">
                  <tr>
                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-widest text-cocoa/50">Name</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-widest text-cocoa/50">SKU</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-widest text-cocoa/50">Price</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-widest text-cocoa/50">Status</th>
                    <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-xs font-bold uppercase tracking-widest text-cocoa/50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/5 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="whitespace-nowrap py-12 text-sm text-center text-cocoa/50">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-cocoa/[0.01] transition-colors">
                        <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm font-bold text-cocoa">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm font-medium text-cocoa/70">{product.sku}</td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm font-medium text-cocoa/70">GH₵ {product.price.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-5 pl-3 pr-6">
                          <div className="flex items-center justify-end gap-4">
                            <button 
                              onClick={() => setQrProduct(product)}
                              className="text-cocoa/50 hover:text-cocoa hover:bg-cocoa/5 p-2 rounded-lg transition-all"
                              title="Generate QR Code"
                            >
                              <span className="sr-only">Generate QR Code</span>
                              <QrCode className="h-5 w-5" />
                            </button>
                            <Link 
                              href={`/admin/products/${product.slug}`} 
                              className="text-terracotta hover:bg-terracotta/10 p-2 rounded-lg transition-all"
                              title="Edit Product"
                            >
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-5 w-5" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                              title="Delete Product"
                            >
                              <span className="sr-only">Delete</span>
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-ivory rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setQrProduct(null)}
              className="absolute top-4 right-4 text-cocoa/50 hover:text-cocoa transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-cormorant text-2xl font-bold text-cocoa mb-2 pr-6">
              {qrProduct.name}
            </h3>
            <p className="text-xs text-cocoa/70 uppercase tracking-widest mb-6">Product QR Code</p>
            
            <div className="bg-white p-4 rounded-xl shadow-inner border border-cocoa/5 flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://ldnaturals.com/verify/${qrProduct.slug}`)}`}
                  alt={`QR Code for ${qrProduct.name}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-cocoa/60 mb-4 px-4 leading-relaxed">
                Scan this code to instantly open the product page on your mobile device.
              </p>
              <button 
                onClick={handleDownloadQr}
                disabled={downloadingQr}
                className="w-full inline-flex justify-center items-center rounded-md bg-cocoa px-4 py-2.5 text-xs font-semibold text-ivory shadow-sm hover:bg-terracotta transition-colors uppercase tracking-widest disabled:opacity-50"
              >
                {downloadingQr ? "Downloading..." : "Download HQ Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
