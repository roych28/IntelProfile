import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { DataProvider } from '@/app/lib/data-provider'; // Adjust the import path

export const metadata: Metadata = {
  title: 'Profile inteligence',
  description: ''
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <DataProvider> 
          <main className="flex-1 pt-14 overflow-hidden">{children}</main>
        </DataProvider> 
      </div>
    </>
  );
}
