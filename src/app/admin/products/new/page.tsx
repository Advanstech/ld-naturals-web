'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    price: 0,
    description: '',
    isActive: true,
    inventoryQuantity: 0,
    lowStockAlert: 10,
    imageUrls: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrl = () => {
    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const removeImageUrl = (index: number) => {
    if (formData.imageUrls.length <= 1) return;
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await fetchApi(`/products`, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
        }),
      });
      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white rounded-full border border-cocoa/10 hover:bg-cocoa/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-cocoa" />
        </Link>
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-cocoa">Add Product</h1>
          <p className="text-cocoa/60 mt-1">Create a new product for your store.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-cocoa/5 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Product Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Slug (URL)</label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">SKU</label>
            <input 
              type="text" 
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Price (GH₵)</label>
            <input 
              type="number" 
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Description</label>
          <textarea 
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Inventory Quantity</label>
            <input 
              type="number" 
              name="inventoryQuantity"
              value={formData.inventoryQuantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Low Stock Alert Level</label>
            <input 
              type="number" 
              name="lowStockAlert"
              value={formData.lowStockAlert}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-cocoa/50">Image URLs</label>
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-3">
              <input 
                type="url" 
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                className="w-full px-4 py-3 bg-ivory/50 rounded-xl border border-cocoa/10 focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none text-sm font-medium text-cocoa transition-all"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={() => removeImageUrl(index)}
                disabled={formData.imageUrls.length <= 1}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 disabled:opacity-50 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cocoa/70 hover:text-terracotta transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>

        <div className="flex items-center gap-3 py-4 p-4 bg-ivory/30 rounded-xl border border-cocoa/5">
          <input 
            type="checkbox" 
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 rounded border-cocoa/20 text-terracotta focus:ring-terracotta bg-white"
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-cocoa cursor-pointer select-none">
            Product is Active (visible to customers)
          </label>
        </div>

        <div className="pt-8 border-t border-cocoa/5 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-cocoa text-ivory px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
