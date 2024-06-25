import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Timeline from '@/components/ui/timeline';
import { MagnifyingGlassIcon, PersonIcon, GroupIcon, GlobeIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Leak, IdentifierDetails, Profile, StatsData } from '@/types';

export const renderProfiles = (profiles: Profile[]): JSX.Element[] => {
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
        {profile.profile_pic && (
          <div className="mt-4 text-center">
            <img
              src={profile.profile_pic}
              alt={`${profile.source} profile`}
              className="rounded-full w-24 h-24 object-cover mx-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  ));
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
  return leaks.map((leak, index) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <CardTitle>{leak.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>URL:</strong> {leak.url || 'N/A'}</p>
        <p><strong>Date:</strong> {new Date(leak.date * 1000).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  ));
};

export const renderTimeline = (leaks: Leak[]): JSX.Element => {
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

export const renderSummary = (details: IdentifierDetails): JSX.Element => (
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


