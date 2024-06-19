'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCases } from '@/app/lib/data-provider';
import BreadCrumb from '@/components/breadcrumb';

const breadcrumbItems = [{ title: 'Cases', link: '/dashboard/cases' }];
const CasesPage: React.FC = () => {
  const { cases } = useCases();
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.push(`/dashboard/cases/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center h-full">
            <BreadCrumb items={breadcrumbItems} className="mb-0" />
          </div>
          <Link
            href="/dashboard/cases/new"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Case
          </Link>
        </div>
      </header>
      <main className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => handleNavigation(caseItem.id)}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative w-full h-0 pb-[100%]"> {/* Square aspect ratio */}
                <Image
                  src={'/case1.jpg'} // Ensure the image path is correct
                  alt="Case Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-2">
                <h2 className="text-lg font-bold mb-2">{caseItem.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CasesPage;
