import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Timeline from '@/components/ui/timeline';
import { MagnifyingGlassIcon, PersonIcon, GroupIcon, GlobeIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Leak, IdentifierDetails, Profile } from '@/types';

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

export const renderStatsCards = (sourcesScanned: number): JSX.Element => (
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


