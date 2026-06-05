'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, CheckCircle2, Phone, MessageSquare, User, Loader2, Sparkles, Globe } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import localCountries from '@/lib/countries.json';


export default function VerifyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('GH'); // Default ISO Code for Ghana
  const [countries, setCountries] = useState<any[]>(localCountries);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load product & countries
  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await fetchApi(`/products/${slug}`);
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || 'Product not found.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // Load persisted form data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('verify_name');
    const savedPhone = localStorage.getItem('verify_phone');
    const savedCode = localStorage.getItem('verify_code');
    const savedComment = localStorage.getItem('verify_comment');
    const savedRating = localStorage.getItem('verify_rating');

    if (savedName) setReviewerName(savedName);
    if (savedPhone) setPhoneNumber(savedPhone);
    if (savedCode) setCountryCode(savedCode);
    if (savedComment) setComment(savedComment);
    if (savedRating) setRating(parseInt(savedRating, 10));
  }, []);

  // Save to localStorage when form values change
  useEffect(() => {
    localStorage.setItem('verify_name', reviewerName);
    localStorage.setItem('verify_phone', phoneNumber);
    localStorage.setItem('verify_code', countryCode);
    localStorage.setItem('verify_comment', comment);
    localStorage.setItem('verify_rating', rating.toString());
  }, [reviewerName, phoneNumber, countryCode, comment, rating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!product?.id) throw new Error("Invalid product ID");
      if (rating === 0) throw new Error("Please select a star rating before submitting.");

      await fetchApi(`/verify/reward/${product.id}`, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          countryCode,
          rating,
          comment,
          reviewerName,
        }),
      });

      setSuccess(true);
      // Optional: Clear form data after success
      // localStorage.clear();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✕</span>
          </div>
          <h2 className="text-2xl font-cormorant font-bold text-cocoa mb-2">Invalid Code</h2>
          <p className="text-cocoa/70">{error || "We couldn't verify this product's authenticity."}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-cormorant font-bold text-cocoa mb-4">Thank You!</h2>
          <p className="text-cocoa/70 mb-8 leading-relaxed">
            Your review has been successfully submitted. We've verified your product and your airtime reward is currently being processed to your phone number.
          </p>
          <a href="/" className="inline-block bg-terracotta text-white px-8 py-3 rounded-full font-medium hover:bg-terracotta/90 transition-colors">
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        
        {/* Verification Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 transform transition-all hover:scale-[1.01]">
          <div className="bg-green-600 text-white p-4 flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold tracking-wide uppercase text-sm">Verified Original Product</span>
          </div>
          
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 relative flex-shrink-0 bg-ivory rounded-2xl overflow-hidden border border-cocoa/5 flex items-center justify-center">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // prevent infinite loop
                    e.currentTarget.src = '/product-scented.jpeg'; // fallback
                  }}
                />
              ) : (
                <Sparkles className="w-8 h-8 text-cocoa/20" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-terracotta font-semibold uppercase tracking-widest mb-1">Living Diary</p>
              <h1 className="text-2xl sm:text-3xl font-cormorant font-bold text-cocoa">{product.name}</h1>
              <p className="text-cocoa/60 mt-2 text-sm">{product.shortDesc}</p>
            </div>
          </div>
        </div>

        {/* Review & Reward Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-cormorant font-bold text-cocoa mb-2">Claim Your Airtime Reward</h2>
            <p className="text-cocoa/60 text-sm">
              Leave a quick review and provide your phone number to receive a free airtime top-up as our thank you!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rating */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-cocoa mb-3">How would you rate this product?</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-cocoa mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-terracotta" />
                Your Name
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl border border-cocoa/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all bg-ivory/50"
              />
            </div>

            {/* Testimony */}
            <div>
              <label className="block text-sm font-medium text-cocoa mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-terracotta" />
                Your Testimony (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Tell us what you loved about it..."
                className="w-full px-4 py-3 rounded-xl border border-cocoa/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all bg-ivory/50 resize-none"
              ></textarea>
            </div>

            <div className="h-px bg-cocoa/10 my-8"></div>

            {/* Phone Number with Country Select */}
            <div>
              <label className="block text-sm font-medium text-cocoa mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-terracotta" />
                Phone Number for Airtime
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-cocoa/50">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full pl-9 pr-8 py-3 rounded-xl border border-cocoa/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all bg-ivory/50 appearance-none text-sm"
                  >
                    {countries.length > 0 ? (
                      countries.map((country: any) => (
                        <option key={country.isoName} value={country.isoName}>
                          {country.name} ({country.callingCodes?.[0] || ''})
                        </option>
                      ))
                    ) : (
                      <option value="GH">Ghana (+233)</option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-cocoa/50">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="24 123 4567"
                  className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-cocoa/20 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all bg-ivory/50"
                />
              </div>
              <p className="text-xs text-cocoa/50 mt-2">Enter your number without the leading zero.</p>
            </div>

            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cocoa text-ivory py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-terracotta transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Submit & Claim Reward</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
