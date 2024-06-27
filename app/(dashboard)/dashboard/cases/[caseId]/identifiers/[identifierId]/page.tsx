'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import Breadcrumbs from '@/components/breadcrumbs';
import { IdentifierDetails, CaseDetails } from '@/types';
import { mergeDataBySource } from '@/app/lib/utils';
import { renderStatsCards, renderLeaks, renderTimeline, renderSummary, renderProfiles } from '@/components/results-helper-utils';

import dynamic from 'next/dynamic';

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false
});

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

  const statsData = {
    sourcesScanned,
    names: -1,
    usernames: -1,
    totalAccounts: -1,
    countries: -1,
  };

  return (
    <div className="bg-gray-900 text-white max-h-[96vh] flex flex-col pb-4">
      <header className="bg-gray-800 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex h-full">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      </header>
      <div className="flex-1 max-h-screen overflow-y-auto p-6">
        {identifierDetails ? (
          <>
            {identifierDetails?.results?.[0]?.data?.leaks && identifierDetails.results[0].data.leaks.length > 0 && (
              <>
                <div className="col-span-1">
                  {renderStatsCards(statsData)}
                </div>
                <div className="col-span-1">
                  {renderSummary(identifierDetails)}
                </div>
                <div className="col-span-1">
                  {renderTimeline(identifierDetails.results[0].data.leaks)}
                </div>
                <div className="col-span-1 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="">
                      {renderLeaks(identifierDetails.results[0].data.leaks)}
                    </div>
                    <div className="">
                      {identifierDetails.results[0].data.profiles && identifierDetails.results[0].data.profiles.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                          {renderProfiles(identifierDetails.results[0].data.profiles)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mb-4">
                  <LeafletMap />
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
