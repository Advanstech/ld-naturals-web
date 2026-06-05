import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: 'Admin Dashboard - E-Naturals',
  description: 'Manage E-Naturals products, orders, and customers.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-ivory font-inter text-cocoa">
      <div className="sticky top-0 h-screen flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 w-full bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
