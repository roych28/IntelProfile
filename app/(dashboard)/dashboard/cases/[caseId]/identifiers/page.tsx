'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import Breadcrumbs from '@/components/breadcrumbs';
import { CaseDetails, Identifier, StatsData, Existor, Profile } from '@/types';
import { renderStatsCards, renderLeaks, renderTimeline, renderSummary, renderProfilePictures, renderPartialRecoveryData, renderExistors, renderPhones, renderPasswords } from '@/components/results-helper-utils';
import dynamic from 'next/dynamic';

const IdentifierPage: React.FC = () => {
  const { caseId } = useParams();
  const searchParams = useSearchParams();
  const { getCaseById } = useCases();
  const [mergedIdentifier, setMergedIdentifier] = useState<Identifier | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false
  });

  useEffect(() => {
    if (caseId) {
      const ids = searchParams.get('ids') || '';
      const idsArray = ids.split(',');

      const caseDetails: CaseDetails | undefined = getCaseById(caseId);
      if (caseDetails) {
        const foundIdentifiers = caseDetails.identifiers?.filter(
          (identifier: Identifier) => idsArray.includes(identifier.id)
        ) || [];

        const mergedData: Identifier = mergeIdentifiers(foundIdentifiers);
        setMergedIdentifier(mergedData);

        // Aggregate stats for the merged identifier
        const allProfiles = mergedData.results_json?.profiles || [];
        const allExistors = mergedData.results_json?.existors || [];
        const aggregatedStats = calculateStats(allProfiles, allExistors);
        setStatsData(aggregatedStats);
      }
    }
  }, [caseId, searchParams, getCaseById]);

  const breadcrumbItems = [
    { title: 'Cases', link: '/dashboard/cases' },
    { title: `${caseId}`, link: `/dashboard/cases/${caseId}` },
    { title: `Identifiers details`, link: `/dashboard/cases/${caseId}/identifiers?ids=${searchParams.get('ids')}` },
  ];

  const mergeIdentifiers = (identifiers: Identifier[]): Identifier => {
    const merged: Identifier = {
      id: identifiers.map(identifier => identifier.id).join(', '),
      type: identifiers.map(identifier => identifier.type).join(', '),
      status: identifiers.map(identifier => identifier.status).join(', '),
      created_at: identifiers.map(identifier => identifier.created_at).join(', '),
      results_json: {
        profiles: [],
        leaks: [],
        existors: [],
        partial_recovery: [],
        passwords: [],
        phones: [],
        emails: [], // Add emails array
        pictures: [], // Add pictures array
      },
    };

    identifiers.forEach(identifier => {
      if (identifier.results_json) {
        merged.results_json.profiles.push(...(identifier.results_json.profiles || []));
        merged.results_json.leaks.push(...(identifier.results_json.leaks || []));
        merged.results_json.existors.push(...(identifier.results_json.existors || []));
        merged.results_json.partial_recovery.push(...(identifier.results_json.partial_recovery || []));
        merged.results_json.passwords.push(...(identifier.results_json.passwords || []));
        merged.results_json.phones.push(...(identifier.results_json.phones || []));
        merged.results_json.emails.push(...(identifier.results_json.emails || [])); // Merge emails
        merged.results_json.pictures.push(...(identifier.results_json.pictures || [])); // Merge pictures
      }
    });

    return merged;
  };

  const calculateStats = (profiles: Profile[] | undefined, existors: Existor[] | undefined): StatsData => {
    const existorsSet = new Set(existors?.filter(existor => existor.exists).map(existor => existor.source));
    const existorsProfiles = profiles?.filter(profile => existorsSet.has(profile.source));
    const totalAccounts = existorsProfiles?.length;
    const namesCount = existorsProfiles?.filter(profile => profile.firstname || profile.lastname).length;
    const usernamesCount = existorsProfiles?.filter(profile => profile.username).length;
    const sourcesScanned = existorsSet?.size;

    return {
      sourcesScanned: sourcesScanned || 0,
      names: namesCount || 0,
      usernames: usernamesCount || 0,
      totalAccounts: totalAccounts || 0,
      countries: 0,
      existors: existors?.filter(existor => existor.exists).length || 0,
    };
  };

  return (
    <div className="max-h-[96vh] flex flex-col pb-4">
      <header className="py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex h-full">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      </header>
      <div className="flex-1 max-h-screen overflow-y-auto p-6">
        {mergedIdentifier ? (
          <>
            {statsData && (
              <>
                <div className="col-span-1">
                  {renderStatsCards(statsData)}
                </div>
                <div className="col-span-1">
                  <div key={mergedIdentifier.id}>
                    {renderSummary(mergedIdentifier)}
                    {/*mergedIdentifier.results_json?.leaks && (
                      <div className="col-span-1 mb-4">
                        {renderTimeline(mergedIdentifier.results_json.leaks)}
                        {renderLeaks(mergedIdentifier.results_json.leaks)}
                      </div>
                    )*/}
                    {mergedIdentifier.results_json?.profiles && (
                      <div className="col-span-1 mb-4">
                        {renderProfilePictures(mergedIdentifier.results_json.profiles)}
                      </div>
                    )}
                    <div className="col-span-1 mb-4">
                      {renderPartialRecoveryData(mergedIdentifier.results_json.partial_recovery)}
                    </div>
                    <div className="col-span-1 mb-4">
                      {renderExistors(
                        mergedIdentifier.results_json.existors,
                        mergedIdentifier.results_json.profiles,
                        mergedIdentifier.results_json.emails,
                        mergedIdentifier.results_json.phones,
                        mergedIdentifier.results_json.pictures
                      )}
                    </div>
                    <div className="col-span-1 mb-4">
                      {renderPasswords(mergedIdentifier.results_json.passwords)}
                    </div>
                    <div className="col-span-1 mb-4">
                      {renderPhones(mergedIdentifier.results_json.phones)}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mb-6">
                  <LeafletMap />
                </div>
              </>
            )}
          </>
        ) : (
          caseId ? (
            <div className="text-red-500">Identifiers not found.</div>
          ) : (
            <div className="text-yellow-500">Loading case details...</div>
          )
        )}
      </div>
    </div>
  );
};

export default IdentifierPage;
