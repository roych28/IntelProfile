'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import CaseForm from './CaseForm';
import PageHeader from '@/components/layout/page-header';

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
    <div className="max-h-screen">
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <div className="mx-auto py-8 px-6">
        {loading ? (
          <div className="flex justify-center items-center">
            <span>Loading...</span>
          </div>
        ) : (
          caseId && caseDetails ? (
            <CaseForm initialData={caseDetails} />
          ) : (
            <CaseForm />
          )
        )}
      </div>
    </div>
  );
};

export default CasePage;
