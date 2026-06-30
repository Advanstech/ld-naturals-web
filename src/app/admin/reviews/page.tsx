"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, CheckCircle2, ShieldCheck, Download, Eye, X, Star, MessageSquare } from "lucide-react";
import { fetchApi } from "@/lib/api";
import localCountries from "@/lib/countries.json";

const getCountryInfo = (isoName: string) => {
  const country = localCountries.find((c: any) => c.isoName === isoName);
  if (!country) return { name: isoName, callingCode: '' };
  return { name: country.name, callingCode: country.callingCodes[0] || '' };
};

export default function AdminVerificationsPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'reviews'>('verifications');
  const [claims, setClaims] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [crediting, setCrediting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [claimsData, reviewsData] = await Promise.all([
          fetchApi("/verify/admin/claims"),
          fetchApi("/verify/admin/reviews"),
        ]);
        setClaims(claimsData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClaims = claims.filter(c => 
    c.phoneNumber?.includes(searchTerm) || 
    c.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.reviewerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreditAirtime = async () => {
    if (!selectedClaim) return;
    setCrediting(true);
    try {
      await fetchApi('/verify/admin/credit', {
        method: 'POST',
        body: JSON.stringify({
          productId: selectedClaim.productId,
          phoneNumber: selectedClaim.phoneNumber,
          countryCode: selectedClaim.countryCode,
          reviewerName: selectedClaim.reviewerName,
        }),
      });
      alert("Airtime credited successfully!");
      setSelectedClaim(null);
      // Refresh claims list
      const data = await fetchApi('/verify/admin/claims');
      setClaims(data);
    } catch (err: any) {
      console.error('Failed to credit airtime', err);
      alert(err.message || 'Failed to credit airtime. Please try again.');
    } finally {
      setCrediting(false);
    }
  };

  const filteredReviews = reviews.filter(r =>
    r.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reviewerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-cocoa flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-600" /> Verifications & Reviews
          </h1>
          <p className="text-cocoa/60 mt-1">Manage QR Code verifications, airtime rewards, and customer reviews.</p>
        </div>
        <button className="flex items-center gap-2 bg-ivory text-cocoa border border-cocoa/20 px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-cocoa/5 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cocoa/10">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'verifications'
              ? 'border-terracotta text-terracotta'
              : 'border-transparent text-cocoa/50 hover:text-cocoa'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> QR Verifications ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'reviews'
              ? 'border-terracotta text-terracotta'
              : 'border-transparent text-cocoa/50 hover:text-cocoa'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> All Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'verifications' && (<>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-cocoa/5 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa/50 mb-2">Total Verifications</h3>
          <p className="text-3xl font-bold text-cocoa">{claims.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-cocoa/5 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa/50 mb-2">Rewards Claimed</h3>
          <p className="text-3xl font-bold text-cocoa">{claims.filter(c => c.rewardClaimed).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-cocoa/5 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-cocoa/50 mb-2">Total Airtime Value (GHS)</h3>
          <p className="text-3xl font-bold text-cocoa">
            GH₵ {claims.reduce((acc, curr) => acc + (curr.claimedAmount || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-cocoa/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cocoa/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/40" />
            <input 
              type="text" 
              placeholder="Search by phone or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-ivory/50 border border-cocoa/10 rounded-xl focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cocoa/5 text-cocoa/70 text-xs uppercase tracking-widest">
                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                <th className="p-4 font-semibold whitespace-nowrap">Customer</th>
                <th className="p-4 font-semibold whitespace-nowrap">Product</th>
                <th className="p-4 font-semibold whitespace-nowrap">Phone Number</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-terracotta" />
                  </td>
                </tr>
              ) : filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-cocoa/50">
                    No verifications found.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="border-b border-cocoa/5 hover:bg-cocoa/[0.02] transition-colors">
                    <td className="p-4 text-sm whitespace-nowrap">
                      {new Date(claim.scannedAt).toLocaleDateString()} <br />
                      <span className="text-xs text-cocoa/50">{new Date(claim.scannedAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="p-4 text-sm font-bold text-cocoa whitespace-nowrap">
                      {claim.reviewerName || 'Customer'}
                    </td>
                    <td className="p-4 text-sm font-medium text-cocoa/80">
                      {claim.product?.name || 'Unknown Product'}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap font-mono text-cocoa/70">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <img 
                            src={`https://s3.amazonaws.com/rld-flags/${claim.countryCode?.toLowerCase() || 'gh'}.svg`} 
                            alt="flag" 
                            className="w-4 h-3 object-cover rounded-[2px] shadow-sm"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span>{getCountryInfo(claim.countryCode).callingCode} {claim.phoneNumber}</span>
                        </div>
                        <span className="text-[10px] uppercase font-sans tracking-widest text-cocoa/40">{getCountryInfo(claim.countryCode).name}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {claim.rewardClaimed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Claimed (GH₵ {claim.claimedAmount})
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedClaim(claim)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-cocoa/5 hover:bg-cocoa/10 text-cocoa rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      </>) /* end verifications tab */}

      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-cocoa/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-cocoa/5">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/40" />
              <input
                type="text"
                placeholder="Search by customer or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ivory/50 border border-cocoa/10 rounded-xl focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cocoa/5 text-cocoa/70 text-xs uppercase tracking-widest">
                  <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Customer</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Product</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Rating</th>
                  <th className="p-4 font-semibold">Review</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-terracotta" /></td></tr>
                ) : filteredReviews.length === 0 ? (
                  <tr><td colSpan={5} className="p-12 text-center text-cocoa/50">No reviews found.</td></tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b border-cocoa/5 hover:bg-cocoa/[0.02] transition-colors">
                      <td className="p-4 text-sm whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString()}<br />
                        <span className="text-xs text-cocoa/50">{new Date(review.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="p-4 text-sm font-bold text-cocoa whitespace-nowrap">
                        {review.reviewerName || `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 'Customer'}
                        {review.user?.phone && <div className="text-xs font-normal font-mono text-cocoa/50">{review.user.phone}</div>}
                      </td>
                      <td className="p-4 text-sm font-medium text-cocoa/80 whitespace-nowrap">
                        {review.product?.name || 'Unknown Product'}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                          ))}
                          <span className="ml-1 text-xs text-cocoa/60">{review.rating}/5</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-cocoa/70 max-w-xs">
                        <p className="line-clamp-2 italic">{review.comment || <span className="text-cocoa/30 not-italic">No comment</span>}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-ivory rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setSelectedClaim(null)}
              className="absolute top-6 right-6 text-cocoa/50 hover:text-cocoa transition-colors p-2 bg-white rounded-full shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="font-cormorant text-3xl font-bold text-cocoa mb-1 pr-10">
              Review Details
            </h3>
            <p className="text-xs text-cocoa/60 uppercase tracking-widest mb-8">Verification & Claim Request</p>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white p-5 rounded-2xl border border-cocoa/5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cocoa/50 mb-1">Customer</p>
                  <p className="text-lg font-bold text-cocoa">{selectedClaim.reviewerName || 'Customer'}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cocoa/50 mb-1">Phone Number & Country</p>
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://s3.amazonaws.com/rld-flags/${selectedClaim.countryCode?.toLowerCase() || 'gh'}.svg`} 
                      alt="flag" 
                      className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <p className="text-lg font-mono font-bold text-cocoa">{getCountryInfo(selectedClaim.countryCode).callingCode} {selectedClaim.phoneNumber}</p>
                  </div>
                  <p className="text-xs text-cocoa/50 mt-1 font-semibold uppercase tracking-wider">{getCountryInfo(selectedClaim.countryCode).name}</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white p-5 rounded-2xl border border-cocoa/5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cocoa/50 mb-1">Product Verified</p>
                <p className="text-sm font-bold text-cocoa">{selectedClaim.product?.name}</p>
                <p className="text-xs text-cocoa/60 mt-1">Scanned on {new Date(selectedClaim.scannedAt).toLocaleString()}</p>
              </div>

              {/* Review Info */}
              <div className="bg-cocoa/[0.03] p-6 rounded-2xl border border-cocoa/10">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < (selectedClaim.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                    />
                  ))}
                </div>
                <p className="text-cocoa text-sm italic leading-relaxed">
                  "{selectedClaim.comment || 'No written testimony provided.'}"
                </p>
              </div>

              {/* Action Area */}
              <div className="pt-4">
                {selectedClaim.rewardClaimed ? (
                  <div className="w-full flex justify-center items-center gap-2 bg-green-50 text-green-700 py-4 rounded-xl border border-green-100 font-bold uppercase tracking-widest text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Airtime Already Sent (GH₵ {selectedClaim.claimedAmount})
                  </div>
                ) : (
                  <button 
                    onClick={handleCreditAirtime}
                    disabled={crediting}
                    className="w-full flex justify-center items-center gap-2 bg-cocoa text-ivory py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta transition-colors disabled:opacity-50 shadow-md"
                  >
                    {crediting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {crediting ? 'Processing Transfer...' : 'Send Airtime Reward Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
