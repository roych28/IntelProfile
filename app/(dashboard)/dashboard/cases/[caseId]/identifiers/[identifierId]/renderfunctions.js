import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import Timeline from '@/components/ui/Timeline';
import dayjs from 'dayjs';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export const renderBreadcrumbs = (breadcrumbItems) => (
  <Breadcrumb>
    <BreadcrumbList>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={item.link} prefetch={false}>
                {item.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index < breadcrumbItems.length - 1 && (
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          )}
        </React.Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);

export const renderStatsCards = (sourcesScanned) => (
  <div className="flex space-x-4 mb-4">
    <Card className="w-48">
      <CardContent>
        <p><strong>Sources Scanned</strong></p>
        <p>{sourcesScanned}</p>
      </CardContent>
    </Card>
    <Card className="w-48">
      <CardContent>
        <p><strong>Names</strong></p>
        <p>3</p>
      </CardContent>
    </Card>
    <Card className="w-48">
      <CardContent>
        <p><strong>Usernames</strong></p>
        <p>2</p>
      </CardContent>
    </Card>
    <Card className="w-48">
      <CardContent>
        <p><strong>Total Accounts</strong></p>
        <p>20</p>
      </CardContent>
    </Card>
    <Card className="w-48">
      <CardContent>
        <p><strong>Countries</strong></p>
        <p>1</p>
      </CardContent>
    </Card>
  </div>
);

export const renderBreachedAccounts = (breaches) => {
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

export const renderProfiles = (profiles) => {
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

export const renderTimeline = (leaks) => {
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

export const renderSummary = (details) => (
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
