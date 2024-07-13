'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import CaseForm from './CaseForm';
import PageHeader from '@/components/layout/page-header';
import { Case } from '@/types';

const CasePage: React.FC = () => {
  const { caseId } = useParams();
  const { getCaseById } = useCases();
  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;

  useEffect(() => {
    if (caseIdString && caseIdString !== 'new') {
      const fetchCaseDetails = async () => {
        const details = await getCaseById(caseIdString);
        if (details) {
          setCaseDetails(details);
        }
      };
      fetchCaseDetails();
    }
  }, [caseIdString, getCaseById]);

  const breadcrumbItems = [
    { title: 'Cases', link: '/dashboard/cases' },
    { title: caseDetails?.name || (caseIdString === 'new' ? 'New Case' : 'Loading...'), link: `/dashboard/cases/${caseIdString}` },
  ];

  return (
    <div className="max-h-screen">
      <PageHeader breadcrumbItems={breadcrumbItems} />
      <div className="mx-auto py-8 px-6">
        {caseIdString === 'new' ? (
          <CaseForm initialData={{ name: '', identifiers: [] }} />
        ) : (
          !caseDetails ? (
            <div className="flex justify-center items-center">
              <span>Loading...</span>
            </div>
          ) : (
            <CaseForm initialData={caseDetails} />
          )
        )}
      </div>
    </div>
  );
};

export default CasePage;
