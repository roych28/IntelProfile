'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCases } from '@/app/lib/data-provider';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import Timeline from '@/components/ui/Timeline';
import dayjs from 'dayjs';

const IdentifierPage = () => {
  const { caseId, identifierId } = useParams();
  const [identifierDetails, setIdentifierDetails] = useState(null);
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

  const mergeDataBySource = (data) => {
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

  const renderBreachedAccounts = (breaches) => {
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

  const renderProfiles = (profiles) => {
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

  const renderTimeline = (leaks) => {
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

  const mergedSources = mergeDataBySource(identifierDetails?.results?.[0]?.data?.profiles || []);
  const sourcesScanned = Object.keys(mergedSources).length;

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Identifier Search</h1>
          <p>Email: {identifierDetails?.query}</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-700 text-white px-3 py-1 rounded">PDF</button>
          <button className="bg-gray-700 text-white px-3 py-1 rounded">DOCX</button>
          <button className="bg-gray-700 text-white px-3 py-1 rounded">JSON</button>
          <button className="bg-gray-700 text-white px-3 py-1 rounded">CSV</button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <Card className="col-span-1">
          <CardContent>
            <p><strong>Sources Scanned</strong></p>
            <p>{sourcesScanned}</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <p><strong>Names</strong></p>
            <p>3</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <p><strong>Usernames</strong></p>
            <p>2</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <p><strong>Total Accounts</strong></p>
            <p>20</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <p><strong>Countries</strong></p>
            <p>1</p>
          </CardContent>
        </Card>
      </div>
      {identifierDetails ? (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>ID:</strong> {identifierDetails.id}</p>
              <p><strong>Query:</strong> {identifierDetails.query}</p>
              <p><strong>Type:</strong> {identifierDetails.type}</p>
              <p><strong>Status:</strong> {identifierDetails.status}</p>
              <p><strong>Created At:</strong> {new Date(identifierDetails.created_at).toLocaleString()}</p>
            </CardContent>
          </Card>
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
  );
};

export default IdentifierPage;
