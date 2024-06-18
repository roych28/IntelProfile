import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { DataProvider } from '@/app/lib/data-provider'; // Adjust the import path

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <DataProvider> 
          <main className="flex-1 overflow-hidden pt-14">{children}</main>
        </DataProvider>
       
      </div>
    </>
  );
}
