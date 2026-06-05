"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Package, LogOut, ArrowRight, Settings, LayoutDashboard, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/api";

type Tab = 'overview' | 'orders' | 'settings' | 'addresses';

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Settings Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);
      loadDashboardData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Fetch user profile and role
      const profileData = await fetchApi('/auth/me');
      setUserProfile(profileData);
      setFirstName(profileData?.firstName || '');
      setLastName(profileData?.lastName || '');
      setPhone(profileData?.phone || '');

      // Fetch orders
      const ordersData = await fetchApi('/orders/my-orders');
      setOrders(ordersData);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const updatedUser = await fetchApi('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName,
          lastName,
          phone
        }),
      });
      setUserProfile(updatedUser);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="bg-ivory min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
        </div>
      </main>
    );
  }

  const isAdmin = userProfile?.role === 'ADMIN' || userProfile?.role === 'SUPER_ADMIN';

  return (
    <main className="relative bg-ivory text-cocoa min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 sm:px-6 py-24 sm:py-32 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 bg-white/50 p-8 rounded-3xl border border-cocoa/5 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-cocoa/5 rounded-full flex items-center justify-center text-cocoa shrink-0 border border-cocoa/10">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="font-cormorant text-4xl font-bold mb-1">
                {userProfile?.firstName ? `Hello, ${userProfile.firstName}` : 'My Account'}
              </h1>
              <p className="text-sm text-cocoa/60 font-medium tracking-wide">{session?.user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {isAdmin && (
              <Link 
                href="/admin"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-ivory bg-terracotta hover:bg-terracotta/90 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-4 h-4" /> Admin Portal
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-terracotta bg-terracotta/10 hover:bg-terracotta/20 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-cocoa text-ivory shadow-lg' : 'text-cocoa/60 hover:bg-cocoa/5 hover:text-cocoa'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-cocoa text-ivory shadow-lg' : 'text-cocoa/60 hover:bg-cocoa/5 hover:text-cocoa'}`}
            >
              <Package className="w-5 h-5" /> Order History
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-cocoa text-ivory shadow-lg' : 'text-cocoa/60 hover:bg-cocoa/5 hover:text-cocoa'}`}
            >
              <Settings className="w-5 h-5" /> Settings
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold uppercase tracking-widest transition-all ${activeTab === 'addresses' ? 'bg-cocoa text-ivory shadow-lg' : 'text-cocoa/60 hover:bg-cocoa/5 hover:text-cocoa'}`}
            >
              <MapPin className="w-5 h-5" /> Addresses
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-8 border border-cocoa/5 shadow-sm">
                    <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mb-6">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-cormorant font-bold mb-2">{orders.length}</h3>
                    <p className="text-sm font-semibold uppercase tracking-widest text-cocoa/60">Total Orders</p>
                  </div>
                  <div className="bg-cocoa rounded-3xl p-8 border border-gold/20 shadow-lg text-ivory relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/20 to-transparent rounded-bl-full"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center mb-6">
                        <Settings className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-cormorant font-bold mb-2">Keep your profile updated</h3>
                      <button onClick={() => setActiveTab('settings')} className="text-sm font-semibold text-gold hover:text-ivory transition-colors flex items-center gap-2">
                        Edit Profile <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-cormorant font-bold mb-4">Recent Activity</h3>
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-cocoa/5 shadow-sm">
                      <Package className="w-12 h-12 mx-auto text-cocoa/20 mb-4" />
                      <p className="text-sm text-cocoa/60 mb-6">You haven't placed any orders yet.</p>
                      <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ivory bg-terracotta hover:bg-terracotta/90 rounded-full transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-6 border border-cocoa/5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-cocoa">Latest Order: #{orders[0].orderNumber}</span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-cocoa/60">{new Date(orders[0].createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="inline-block px-3 py-1 bg-cocoa/5 rounded-full text-xs font-semibold uppercase tracking-widest">{orders[0].status}</span>
                        <span className="font-bold">GH₵ {orders[0].total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <h2 className="font-cormorant text-3xl font-bold mb-2">Order History</h2>
                <p className="text-sm text-cocoa/60 mb-8">View and track all your past and current orders.</p>
                
                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-cocoa/5 shadow-sm">
                    <Package className="w-12 h-12 mx-auto text-cocoa/20 mb-4" />
                    <h3 className="font-semibold mb-2">No orders yet</h3>
                    <p className="text-sm text-cocoa/60 mb-6">When you place an order, it will appear here.</p>
                    <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ivory bg-terracotta hover:bg-terracotta/90 rounded-full transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-cocoa/5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-cocoa/5 pb-6">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-semibold text-cocoa/50 mb-1">Order Number</div>
                            <div className="font-semibold text-lg">{order.orderNumber}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-semibold text-cocoa/50 mb-1">Date</div>
                            <div className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-semibold text-cocoa/50 mb-1">Status</div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest font-semibold text-cocoa/50 mb-1">Total</div>
                            <div className="font-bold text-xl">GH₵ {order.total.toFixed(2)}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-ivory rounded-xl relative overflow-hidden shrink-0 border border-cocoa/5">
                                {item.product?.images?.[0]?.url && (
                                  <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{item.product?.name || 'Product'}</h4>
                                <p className="text-xs font-medium text-cocoa/60 mt-1">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                          <Link 
                            href={`/order-confirmation?id=${order.id}`}
                            className="text-xs font-bold uppercase tracking-widest text-terracotta hover:text-cocoa transition-colors flex items-center gap-2"
                          >
                            View Order Details <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <h2 className="font-cormorant text-3xl font-bold mb-2">Account Settings</h2>
                <p className="text-sm text-cocoa/60 mb-8">Update your personal information.</p>

                <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl p-8 border border-cocoa/5 shadow-sm space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-cocoa/70 mb-2">First Name</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-ivory/50 border border-cocoa/20 rounded-xl focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-cocoa/70 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-ivory/50 border border-cocoa/20 rounded-xl focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-cocoa/70 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={session?.user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-cocoa/10 rounded-xl text-cocoa/50 text-sm font-medium cursor-not-allowed"
                    />
                    <p className="text-[10px] text-cocoa/50 mt-2 uppercase tracking-widest">Email cannot be changed.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-cocoa/70 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-ivory/50 border border-cocoa/20 rounded-xl focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="pt-6 mt-6 border-t border-cocoa/5 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-8 py-3 bg-cocoa text-ivory rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-terracotta transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </button>
                    {updateSuccess && (
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5" /> Saved successfully
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <h2 className="font-cormorant text-3xl font-bold mb-2">Saved Addresses</h2>
                <p className="text-sm text-cocoa/60 mb-8">Manage your shipping addresses for a faster checkout.</p>
                
                <div className="bg-white rounded-3xl p-12 text-center border border-cocoa/5 shadow-sm">
                  <MapPin className="w-12 h-12 mx-auto text-cocoa/20 mb-4" />
                  <h3 className="font-semibold mb-2">No addresses saved</h3>
                  <p className="text-sm text-cocoa/60 leading-relaxed">
                    Addresses are automatically saved when you complete an order at checkout. Next time you shop, your address will be securely stored here.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
