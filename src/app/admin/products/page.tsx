'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Plus, Pencil, Trash2, QrCode, X } from 'lucide-react';
import Image from 'next/image';

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
            className="inline-flex items-center rounded-md bg-terracotta px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-terracotta/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-cocoa/10">
                <thead className="bg-ivory/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-cocoa sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">SKU</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/10 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center text-cocoa/60 sm:pl-6">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-cocoa sm:pl-6">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">{product.sku}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">GH₵ {product.price.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            product.isActive ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10'
                          }`}>
                            {product.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                          <button 
                            onClick={() => setQrProduct(product)}
                            className="text-cocoa/70 hover:text-cocoa transition-colors"
                            title="Generate QR Code"
                          >
                            <span className="sr-only">Generate QR Code</span>
                            <QrCode className="h-4 w-4" />
                          </button>
                          <button className="text-terracotta hover:text-cocoa transition-colors">
                            <span className="sr-only">Edit</span>
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`http://localhost:3000/products/${qrProduct.slug}`)}`}
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
              <a 
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`http://localhost:3000/products/${qrProduct.slug}`)}`}
                download={`${qrProduct.slug}-qr.png`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex justify-center items-center rounded-md bg-cocoa px-4 py-2.5 text-xs font-semibold text-ivory shadow-sm hover:bg-terracotta transition-colors uppercase tracking-widest"
              >
                Download HQ Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
