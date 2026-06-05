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
    <div className="flex h-screen overflow-hidden bg-ivory font-inter text-cocoa">
      <Sidebar />
      <main className="flex-1 w-full bg-ivory overflow-y-auto scroll-smooth">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
