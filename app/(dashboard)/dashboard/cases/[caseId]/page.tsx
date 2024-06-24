'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import CaseForm from './CaseForm';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

const CasePage = () => {
  const { caseId } = useParams();
  const { getCaseById, loading } = useCases();

  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
  const caseDetails = getCaseById(caseIdString);

  const breadcrumbItems = [
    { title: 'Cases', link: '/dashboard/cases' },
    { title: `${caseDetails?.name || ''}`, link: `/dashboard/cases/${caseId}` },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="bg-gray-800 text-white py-4 px-6 shadow-md mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex h-full">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={item.link} prefetch={false}>
                          {item.title}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-white">Loading...</span>
        </div>
      ) : (
        caseId && caseDetails ? (
          <CaseForm initialData={caseDetails} />
        ) : (
          <CaseForm />
        )
      )}
    </div>
  );
};

export default CasePage;
