'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import Breadcrumbs from '@/components/breadcrumbs';
import { CaseDetails, Identifier, StatsData, Existor, Profile } from '@/types';
import { renderStatsCards, renderLeaks, renderTimeline, renderSummary, renderProfilePictures, renderPartialRecoveryData, renderExistors, renderPhones, renderPasswords } from '@/components/results-helper-utils';
import dynamic from 'next/dynamic';

const IdentifierPage: React.FC = () => {
  const { caseId } = useParams() as { caseId: string | string[] };
  const searchParams = useSearchParams();
  const { getCaseById } = useCases();
  const [mergedIdentifier, setMergedIdentifier] = useState<Identifier | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [allExistors, setAllExistors] = useState<Existor[]>([]);

  const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false
  });

  useEffect(() => {
    const caseIdStr = Array.isArray(caseId) ? caseId[0] : caseId;
    if (caseIdStr) {
      const ids = searchParams.get('ids') || '';
      const idsArray = ids.split(',');

      const caseDetails: CaseDetails | undefined = getCaseById(caseIdStr);
      if (caseDetails) {
        const foundIdentifiers = caseDetails.identifiers?.filter(
          (identifier: Identifier) => idsArray.includes(identifier.id)
        ) || [];

        const mergedData: Identifier = mergeIdentifiers(foundIdentifiers);
        setMergedIdentifier(mergedData);

        // Aggregate stats for the merged identifier
        const profiles: Profile[] = [];
        const existors: Existor[] = [];
        
        if (mergedData.results_json) {
          mergedData.results_json.forEach(result => {
            if (result.profiles) {
              profiles.push(...result.profiles);
            }
            if (result.existors) {
              existors.push(...result.existors);
            }
          });
        }

        setAllProfiles(profiles);
        setAllExistors(existors);

        const aggregatedStats = calculateStats(profiles, existors);
        setStatsData(aggregatedStats);
      }
    }
  }, [caseId, searchParams, getCaseById]);

  const breadcrumbItems = [
    { title: 'Cases', link: '/dashboard/cases' },
    { title: `${Array.isArray(caseId) ? caseId[0] : caseId}`, link: `/dashboard/cases/${Array.isArray(caseId) ? caseId[0] : caseId}` },
    { title: `Identifiers details`, link: `/dashboard/cases/${Array.isArray(caseId) ? caseId[0] : caseId}/identifiers?ids=${searchParams.get('ids')}` },
  ];

  const mergeIdentifiers = (identifiers: Identifier[]): Identifier => {
    const merged: Identifier = {
      id: identifiers.map(identifier => identifier.id).join(', '),
      case_id: identifiers[0].case_id, // Assuming all identifiers have the same case_id
      query: identifiers.map(identifier => identifier.query).join(', '),
      type: identifiers.map(identifier => identifier.type).join(', '),
      status: identifiers.map(identifier => identifier.status).join(', '),
      created_at: identifiers.map(identifier => identifier.created_at).join(', '),
      results_json: identifiers.flatMap(identifier => identifier.results_json || []),
    };

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
                    {allProfiles.length > 0 && (
                      <div className="col-span-1 mb-4">
                        {renderProfilePictures(allProfiles)}
                      </div>
                    )}
                    <div className="col-span-1 mb-4">
                      {renderPartialRecoveryData(mergedIdentifier.results_json?.flatMap(result => result.partial_recovery || []))}
                    </div>
                    <div className="col-span-1 mb-4">
                      {renderExistors(
                        allExistors,
                        allProfiles,
                        mergedIdentifier.results_json?.flatMap(result => result?.emails || []),
                        mergedIdentifier.results_json?.flatMap(result => result?.phones || []),
                        mergedIdentifier.results_json?.flatMap(result => result?.pictures || [])
                      )}
                    </div>
                    <div className="col-span-1 mb-4">
                      {renderPasswords(mergedIdentifier.results_json?.flatMap(result => result.passwords || []))}
                    </div>
                    <div className="col-span-1 mb-4">
                      {renderPhones(mergedIdentifier.results_json?.flatMap(result => result.phones || []))}
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
