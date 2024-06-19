'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import CaseForm from './CaseForm';

const CasePage = () => {
  const { caseId } = useParams();
  const { getCaseById } = useCases();
  
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;

  const caseDetails = getCaseById(caseIdString);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {caseId && caseDetails ? (
        <CaseForm initialData={caseDetails} />
      ) : (
        <CaseForm />
      )}
    </div>
  );
};

export default CasePage;
