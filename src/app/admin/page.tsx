'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  productsListed: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchApi('/admin/stats');
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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
        <p className="text-xs text-red-600 mt-1">
          (Did you add the database URL in the backend .env file?)
        </p>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign },
    { name: 'Active Orders', value: stats?.activeOrders || 0, icon: Package },
    { name: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users },
    { name: 'Products Listed', value: stats?.productsListed || 0, icon: ShoppingBag },
  ];

  return (
    <div>
      <h1 className="text-3xl font-cormorant font-bold text-cocoa mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white shadow-sm border border-cocoa/10 p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-terracotta/10 p-3">
                <stat.icon className="h-6 w-6 text-terracotta" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-cocoa/60">{stat.name}</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight text-cocoa">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
