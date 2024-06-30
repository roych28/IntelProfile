'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import Breadcrumbs from '@/components/breadcrumbs';
import { IdentifierDetails, CaseDetails } from '@/types';
import { mergeDataBySource } from '@/app/lib/utils';
import { renderStatsCards, renderLeaks, renderTimeline, renderSummary, renderProfiles, renderPartialRecoveryData } from '@/components/results-helper-utils';

import dynamic from 'next/dynamic';

const IdentifierPage: React.FC = () => {
  const { caseId, identifierId } = useParams();
  const { getCaseById } = useCases();
  const [ identifierDetails, setIdentifierDetails] = useState<Identifier | null>(null);
  const [ statsData, setStatsData] = useState<StatsData | null>(null);
  
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
  const caseDetails: CaseDetails | undefined = getCaseById(caseIdString);

  const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false
  });

  useEffect(() => {
    if (caseDetails) {
      const foundIdentifier = caseDetails.identifiers?.find(
        (identifier: IdentifierDetails) => identifier.id === identifierId
      );
      if (foundIdentifier) {
        setIdentifierDetails(foundIdentifier);
        const statsCalculated = calculateStats(foundIdentifier.results[0].data.profiles, foundIdentifier.results[0].data.existors);
        setStatsData(statsCalculated);
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

  const calculateStats = (profiles: Profile[], existors: Existor[]): StatsData => {
    const existorsSet = new Set(existors.filter(existor => existor.exists).map(existor => existor.source));
    const existorsProfiles = profiles.filter(profile => existorsSet.has(profile.source));
    const totalAccounts = existorsProfiles.length;
    const namesCount = existorsProfiles.filter(profile => profile.firstname || profile.lastname).length;
    const usernamesCount = existorsProfiles.filter(profile => profile.username).length;
    const sourcesScanned = existorsSet.size;
  
    return {
      sourcesScanned,
      names: namesCount,
      usernames: usernamesCount,
      totalAccounts,
      countries: 'none', 
      existors: existors.filter(existor => existor.exists).length,
    };
  };

  return (
    <div className="text-white max-h-[96vh] flex flex-col pb-4">
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
                <div className="">
                  {renderPartialRecoveryData(identifierDetails.results[0].data.partial_recovery)}
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
