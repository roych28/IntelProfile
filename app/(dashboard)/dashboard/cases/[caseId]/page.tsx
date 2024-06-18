"use client";

import { useParams } from 'next/navigation';
import React from 'react';
import { useCases } from '@/app/lib/data-provider'; // Adjust the import path

const CasePage = () => {
  const { caseId } = useParams();
  const { getCaseById } = useCases();
  const caseDetails = getCaseById(caseId);

  if (!caseDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Case ID: {caseDetails.id}</h1>
      <p>{caseDetails.description}</p>
    </div>
  );
};

export default CasePage;
