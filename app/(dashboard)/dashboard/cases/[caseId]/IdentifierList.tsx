'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import Breadcrumbs from '@/components/breadcrumbs';
import { IdentifierDetails, CaseDetails } from '@/types';
import { mergeDataBySource } from '@/app/lib/utils';
import { renderStatsCards, renderLeaks, renderTimeline, renderSummary, renderProfiles } from '@/components/results-helper-utils';

const IdentifierPage: React.FC = () => {
  const { caseId, identifierId } = useParams();
  const [identifierDetails, setIdentifierDetails] = useState<IdentifierDetails | null>(null);
  const { getCaseById } = useCases();
  
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
  const caseDetails: CaseDetails | undefined = getCaseById(caseIdString);

  useEffect(() => {
    if (caseDetails) {
      const foundIdentifier = caseDetails.identifiers?.find(
        (identifier: IdentifierDetails) => identifier.id === identifierId
      );
      if (foundIdentifier) {
        setIdentifierDetails(foundIdentifier);
      }
    }
  }, [caseDetails, identifierId]);

  const mergedSources = mergeDataBySource(identifierDetails?.results?.[0]?.data?.profiles || []);
  const sourcesScanned = Object.keys(mergedSources).length;

  const breadcrumbItems = [
    { title: 'Cases', link: '/dashboard/cases' },
    { title: `${caseDetails?.name || ''}`, link: `/dashboard/cases/${caseId}` },
    { title: `Identifier ${identifierId}`, link: `/dashboard/cases/${caseId}/identifier/${identifierId}` },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex h-full">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      </header>
      <div className="flex-1 max-h-96 overflow-y-auto p-6">
        {renderStatsCards(sourcesScanned)}
        {identifierDetails ? (
          <>
            {renderSummary(identifierDetails)}
            {identifierDetails?.results?.[0]?.data?.leaks && identifierDetails.results[0].data.leaks.length > 0 && (
              <>
                <div className="col-span-2">
                  {renderTimeline(identifierDetails.results[0].data.leaks)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Breached Accounts</h2>
                    {renderLeaks(identifierDetails.results[0].data.leaks)}
                  </div>
                  <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Profile Pictures</h2>
                    {identifierDetails?.results?.[0]?.data?.profiles?.length > 0 && (
                      <div className="grid grid-cols-1 gap-4">
                        {renderProfiles(identifierDetails?.results?.[0]?.data?.profiles)}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          caseDetails ? (
            <div className="text-red-500">Identifier not found.</div>
          ) : (
            <div className="text-yellow-500">Loading case details...</div>
          )
        )}
      </div>
    </div>
  );
};

export default IdentifierPage;
