'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import CaseForm from './CaseForm';
import BreadCrumb from '@/components/breadcrumb'; // Import your breadcrumb component

const breadcrumbItems = [{ title: 'cases', link: '/dashboard/cases' }, { title: 'case', link: '/dashboard/cases/case' }];

const CasePage = () => {
  const { caseId } = useParams();
  const { getCaseById } = useCases();
  
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
  const caseDetails = getCaseById(caseIdString);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      {caseId && caseDetails ? (
        <CaseForm initialData={caseDetails} />
      ) : (
        <CaseForm />
      )}
    </div>
  );
};

export default CasePage;
