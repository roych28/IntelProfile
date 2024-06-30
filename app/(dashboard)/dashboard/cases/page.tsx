'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCases } from '@/app/lib/data-provider';
import PageHeader from '@/components/layout/page-header';

const CasesPage: React.FC = () => {
  const { cases } = useCases();
  const router = useRouter();

  const handleNavigation = (id: string) => {
    router.push(`/dashboard/cases/${id}`);
  };

  const breadcrumbItems = [
    { title: 'Cases', link: '#' },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        button={{ link: '/dashboard/cases/new', text: 'New Case' }}
      />
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
