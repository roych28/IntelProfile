import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Timeline from '@/components/ui/timeline';
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, PersonIcon, GroupIcon, GlobeIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Leak, IdentifierDetails, Profile, StatsData } from '@/types';
import { DownloadIcon } from '@radix-ui/react-icons';

export const renderProfiles = (profiles: Profile[]): JSX.Element[] => {
  return (
    <div className="profile-list">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profile Pictures</CardTitle>
          <p className="">Image assets used by the identified profile</p>
          <hr />
        </CardHeader>
        <CardContent>
          <ul className="list-unstyled">
            {profiles
              .filter(profile => profile.profile_pic)  // Only include profiles with profile pictures
              .map((profile, index) => (
                <li key={index} className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <img
                      src={profile.profile_pic}
                      alt={`${profile.source} profile`}
                      className="rounded-full mr-3"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span>{profile.source}</span>
                  </div>
                  <a href={profile.profile_pic} download className="p-0 flex items-center">
                    <DownloadIcon className="text-dark" />
                  </a>
                </li>
              ))}
          </ul>
          <hr />
          <div className="flex justify-end mt-3">
            <Button className="btn btn-dark">Download All</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};





export const renderStatsCards = (data: StatsData): JSX.Element => (
  <div className="flex space-x-4 mb-4">
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14">
      <MagnifyingGlassIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Sources Scanned</p>
        <p className="font-bold">{data.sourcesScanned}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14">
      <PersonIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Names</p>
        <p className="font-bold">{data.names}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14">
      <GroupIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Usernames</p>
        <p className="font-bold">{data.usernames}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14">
      <GroupIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Total Accounts</p>
        <p className="font-bold">{data.totalAccounts}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14">
      <GlobeIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Countries</p>
        <p className="font-bold">{data.countries}</p>
      </CardContent>
    </Card>
  </div>
);


export const renderLeaks = (leaks: Leak[]): JSX.Element[] => {
  return (
    <div className="leaks-list">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Breached Accounts</CardTitle>
          <p className="">List of detected compromised accounts</p>
          <hr />
        </CardHeader>
        <CardContent>
          <ul className="list-unstyled">
            {leaks.map((leak, index) => (
              <li key={index} className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span><strong>Title:</strong> {leak.title}</span>
                  <span><strong>URL:</strong> {leak.url || 'N/A'}</span>
                  <span><strong>Date:</strong> {new Date(leak.date * 1000).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};


export const renderTimeline = (leaks: Leak[]): JSX.Element => {
  const items = leaks.map((leak, index) => ({
    id: index + 1,
    content: leak.title,
    start: dayjs(leak.date * 1000).toISOString(),
    category: 'Hibp'
  }));

  return (
    <div className="mt-8">
      <Timeline items={items} />
    </div>
  );
};

export const renderSummary = (details: IdentifierDetails): JSX.Element => (
  <Card className="mb-4">
    <CardHeader>
    <p><strong>Query:</strong> {details.query}</p>
      <p><strong>Type:</strong> {details.type}</p>
      <p><strong>Status:</strong> {details.results?.[0].status}</p>
      <p><strong>Created At:</strong> {new Date(details.created_at).toLocaleString()}</p>
    </CardHeader>
   
  </Card>
);


