'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Eye, Edit } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  guestEmail?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchApi('/orders');
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
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
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-cormorant font-bold text-cocoa">Orders</h1>
          <p className="mt-2 text-sm text-cocoa/60">
            A list of all recent orders, their current status, and total amounts.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-cocoa/10">
                <thead className="bg-ivory/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-cocoa sm:pl-6">Order ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Customer</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Total</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/10 bg-white">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center text-cocoa/60 sm:pl-6">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const customerName = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email : order.guestEmail || 'Guest';
                      
                      return (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-cocoa sm:pl-6">
                            {order.orderNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">{customerName}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 
                              order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-800' :
                              order.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                            <button className="text-terracotta hover:text-cocoa transition-colors">
                              <span className="sr-only">View</span>
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-terracotta hover:text-cocoa transition-colors">
                              <span className="sr-only">Edit</span>
                              <Edit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
