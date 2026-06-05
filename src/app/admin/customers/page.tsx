'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Eye, Mail } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
  orders: any[];
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchApi('/admin/customers');
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
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
          <h1 className="text-3xl font-cormorant font-bold text-cocoa">Customers</h1>
          <p className="mt-2 text-sm text-cocoa/60">
            A list of all registered customers in your store.
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-cocoa sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Phone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Orders</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cocoa">Joined</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cocoa/10 bg-white">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-center text-cocoa/60 sm:pl-6">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => {
                      const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown';
                      
                      return (
                        <tr key={customer.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-cocoa sm:pl-6">
                            {name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">{customer.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">{customer.phone || 'N/A'}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">{customer.orders?.length || 0}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-cocoa/60">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                            <a href={`mailto:${customer.email}`} className="text-terracotta hover:text-cocoa transition-colors inline-block">
                              <span className="sr-only">Email</span>
                              <Mail className="h-4 w-4" />
                            </a>
                            <button className="text-terracotta hover:text-cocoa transition-colors">
                              <span className="sr-only">View</span>
                              <Eye className="h-4 w-4" />
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
