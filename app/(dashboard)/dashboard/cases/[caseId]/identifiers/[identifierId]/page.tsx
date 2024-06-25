'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Timeline from '@/components/ui/Timeline';
import { MagnifyingGlassIcon, PersonIcon, GroupIcon, GlobeIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';

interface IdentifierDetails {
  query: string;
  type: string;
  status: string;
  created_at: string;
}

interface Breach {
  title: string;
  url: string;
  date: number;
}

interface Profile {
  source: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  profile_pic: string;
}

interface Leak {
  title: string;
  date: number;
}

const mergeDataBySource = (data: any[]) => {
  const mergedData = {};
  data.forEach(item => {
    const source = item.source;
    if (!mergedData[source]) {
      mergedData[source] = { ...item, count: 1 };
    } else {
      mergedData[source].count += 1;
    }
  });
  return mergedData;
};

const renderStatsCards = (sourcesScanned: number): JSX.Element => (
  <div className="flex space-x-4 mb-4">
    <Card className="flex-1 p-1 flex items-center">
      <MagnifyingGlassIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p>Sources Scanned</p>
        <p className="font-bold">{sourcesScanned}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 p-1 flex items-center">
      <PersonIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p>Names</p>
        <p className="font-bold">3</p>
      </CardContent>
    </Card>
    <Card className="flex-1 p-4 flex items-center">
      <GroupIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p>Usernames</p>
        <p className="font-bold">2</p>
      </CardContent>
    </Card>
    <Card className="flex-1 p-4 flex items-center">
      <GroupIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p>Total Accounts</p>
        <p className="font-bold">20</p>
      </CardContent>
    </Card>
    <Card className="flex-1 p-4 flex items-center">
      <GlobeIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p>Countries</p>
        <p className="font-bold">1</p>
      </CardContent>
    </Card>
  </div>
);

const renderBreachedAccounts = (breaches: Breach[]): JSX.Element[] => {
  return breaches.map((breach, index) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <CardTitle>{breach.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>URL:</strong> {breach.url || 'N/A'}</p>
        <p><strong>Date:</strong> {new Date(breach.date * 1000).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  ));
};

const renderProfiles = (profiles: Profile[]): JSX.Element[] => {
  return profiles.map((profile, index) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <CardTitle>{profile.source}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>First Name:</strong> {profile.firstname}</p>
        <p><strong>Last Name:</strong> {profile.lastname}</p>
        <p><strong>City:</strong> {profile.city}</p>
        {profile.profile_pic && <img src={profile.profile_pic} alt={`${profile.source} profile`} />}
      </CardContent>
    </Card>
  ));
};

const renderTimeline = (leaks: Leak[]): JSX.Element => {
  const items = leaks.map((leak, index) => ({
    id: index + 1,
    content: leak.title,
    start: dayjs(leak.date * 1000).toISOString(),
  }));

  return (
    <div className="mt-8">
      <Timeline items={items} />
    </div>
  );
};

const renderSummary = (details: IdentifierDetails): JSX.Element => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <p><strong>Query:</strong> {details.query}</p>
      <p><strong>Type:</strong> {details.type}</p>
      <p><strong>Status:</strong> {details.status}</p>
      <p><strong>Created At:</strong> {new Date(details.created_at).toLocaleString()}</p>
    </CardContent>
  </Card>
);

const IdentifierPage: React.FC = () => {
  const { caseId, identifierId } = useParams();
  const [identifierDetails, setIdentifierDetails] = useState<IdentifierDetails | null>(null);
  const { getCaseById } = useCases();
  
  const caseIdString = Array.isArray(caseId) ? caseId[0] : caseId;
  const caseDetails = getCaseById(caseIdString);

  useEffect(() => {
    if (caseDetails) {
      const foundIdentifier = caseDetails.identifiers?.find(
        (identifier) => identifier.id === identifierId
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
      <div className="flex-1 overflow-y-auto p-6">
        {renderStatsCards(sourcesScanned)}
        {identifierDetails ? (
          <>
            {renderSummary(identifierDetails)}
            {identifierDetails?.results?.[0]?.data?.leaks?.length > 0 && (
              <>
                <div className="col-span-2">
                  {renderTimeline(identifierDetails.results[0].data.leaks)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Breached Accounts</h2>
                    {renderBreachedAccounts(identifierDetails.results[0].data.leaks)}
                  </div>
                  <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Profile Pictures</h2>
                    {identifierDetails?.results?.[0]?.data?.pictures?.length > 0 && (
                      <div className="grid grid-cols-1 gap-4">
                        {identifierDetails.results[0].data.pictures.map((picture, index) => (
                          <div key={index} className="mb-4">
                            <img src={picture.picture} alt={`Profile from ${picture.source}`} className="rounded" />
                            <p>{picture.source}</p>
                          </div>
                        ))}
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
