"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, CheckCircle2, ShieldCheck, Download } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function AdminVerificationsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await fetchApi("/verify/admin/claims");
        setClaims(data);
      } catch (err) {
        console.error("Failed to load claims", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const filteredClaims = claims.filter(c => 
    c.phoneNumber?.includes(searchTerm) || 
    c.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-cocoa flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-600" /> Verifications & Claims
          </h1>
          <p className="text-cocoa/60 mt-1">Manage all QR Code verifications and airtime rewards.</p>
        </div>
        <button className="flex items-center gap-2 bg-ivory text-cocoa border border-cocoa/20 px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-widest hover:bg-cocoa/5 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

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
                <th className="p-4 font-semibold whitespace-nowrap">Product</th>
                <th className="p-4 font-semibold whitespace-nowrap">Phone Number</th>
                <th className="p-4 font-semibold whitespace-nowrap">Reward Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Amount</th>
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
                    <td className="p-4 text-sm font-medium">
                      {claim.product?.name || 'Unknown Product'}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">
                      +{claim.countryCode} {claim.phoneNumber}
                    </td>
                    <td className="p-4">
                      {claim.rewardClaimed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Claimed
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-bold">
                      {claim.claimedAmount ? `GH₵ ${claim.claimedAmount}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
