import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Timeline from '@/components/ui/timeline';
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, PersonIcon, GroupIcon, GlobeIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Leak, Identifier, Profile, StatsData, identifierImages, Existor } from '@/types';
import { DownloadIcon } from '@radix-ui/react-icons';

export const renderProfilePictures = (profiles: Profile[]): JSX.Element => {
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Profile Pictures</CardTitle>
        <p className="">Image assets used by the identified profile.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {profiles
            .filter(profile => profile.profile_pic) // Only include profiles with profile pictures
            .map((profile, index) => (
              <li
                key={index}
                className="flex flex-row justify-between items-center mb-3 item-divider"
                style={index === profiles.length - 1 ? { borderBottom: 'none' } : {}}
              >
                <div className="flex items-center pl-4">
                  <img
                    src={profile.profile_pic}
                    alt={`${profile.source} profile`}
                    className="rounded-full mr-3 icon-size"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <span>{profile.source}</span>
                </div>
                <a href={profile.profile_pic} download className="p-0 flex items-center pr-4">
                  <DownloadIcon className="text-dark" />
                </a>
              </li>
            ))}
        </ul>
        <div className="flex justify-end m-3">
          <Button className="btn btn-dark">Download All</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const renderStatsCards = (data: StatsData | null): JSX.Element => (
  <div className="flex space-x-3 mb-4">
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14 custom-card">
      <MagnifyingGlassIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Sources Scanned</p>
        <p className="font-bold">{data?.sourcesScanned}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14 custom-card">
      <PersonIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Names</p>
        <p className="font-bold">{data?.names}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14 custom-card">
      <GroupIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Usernames</p>
        <p className="font-bold">{data?.usernames}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14 custom-card">
      <GroupIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Total Accounts</p>
        <p className="font-bold">{data?.totalAccounts}</p>
      </CardContent>
    </Card>
    <Card className="flex-1 pt-2 pl-2 flex items-center h-14 custom-card">
      <GlobeIcon className="text-lg mr-2" />
      <CardContent className="text-sm p-2 pt-0">
        <p className="truncate">Countries</p>
        <p className="font-bold">{data?.countries}</p>
      </CardContent>
    </Card>
  </div>
);

export const renderLeaks = (leaks: Leak[]): JSX.Element => {
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Breached Accounts</CardTitle>
        <p className="">List of detected compromised accounts.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {leaks.map((leak, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center mb-3 item-divider"
              style={index === leaks.length - 1 ? { borderBottom: 'none' } : {}}
            >
              <div className="flex flex-row pl-4">
                <span className="mr-4">{leak.title}</span>
                <span className="mr-4">{leak.url || 'unknown url'}</span>
              </div>
              <div className="flex justify-end pr-4">
                <span>{new Date(leak.date * 1000).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
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
    <>
      <Timeline items={items} />
    </>
  );
};

export const renderSummary = (details: Identifier): JSX.Element => (
  <Card className="mb-4 custom-card">
    <CardHeader>
      <p><strong>Query:</strong> {details.query}</p>
      <p><strong>Type:</strong> {details.type}</p>
      <p><strong>Status:</strong> {details.results?.[0]?.data?.status}</p>
      <p><strong>Created At:</strong> {new Date(details.created_at).toLocaleString()}</p>
    </CardHeader>
  </Card>
);

export const renderPartialRecoveryData = (partialRecovery: any[] | undefined): JSX.Element => {
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Partial Recovery Data</CardTitle>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul>
          {partialRecovery?.map((item, index) => (
            <li key={index} className="flex flex-row justify-between items-center mb-3 item-divider">
              <div className="flex items-center pl-4">
                <img
                  src={identifierImages[item.type]}
                  alt={`${item.type} icon`}
                  className="rounded-full mr-3 icon-size"
                />
              </div>
              <div className="flex flex-col items-end flex-1 pr-4">
                <span className="font-semibold">{item.source}</span>
                <span className="text-sm text-gray-400">
                  {Array.isArray(item.value) ? item.value.join(', ') : item.value || 'N/A'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const renderPasswords = (passwords: any[]): JSX.Element => {
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Passwords</CardTitle>
        <p className="">List of detected passwords.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {passwords.map((password, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center mb-3 item-divider"
              style={index === passwords.length - 1 ? { borderBottom: 'none' } : {}}
            >
              <div className="flex flex-row pl-4">
                <span className="mr-4">{password.domain}</span>
                <span className="mr-4">{password.password ? 'Exists' : 'Does not exist'}</span>
              </div>
              <div className="flex justify-end pr-4">
                <span>{new Date(password.last_modified * 1000).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const renderPhones = (phones: any[]): JSX.Element => {
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Phones</CardTitle>
        <p className="">List of detected phone numbers.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {phones.map((phone, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center mb-3 item-divider"
              style={index === phones.length - 1 ? { borderBottom: 'none' } : {}}
            >
              <div className="flex flex-row pl-4">
                <span>{phone.number}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const renderExistors = (existors: Existor[]): JSX.Element => {
  const iconMap: { [key: string]: string } = {
    apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    goodreads: "https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png",
    facebook: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
  };

  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Existors</CardTitle>
        <p className="">List of sources where the account exists.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {existors.filter(existor => existor.exists).map((existor, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center mb-3 item-divider"
              style={index === existors.length - 1 ? { borderBottom: 'none' } : {}}
            >
              <div className="flex flex-row pl-4">
                {iconMap[existor.source] && (
                  <img
                    src={iconMap[existor.source]}
                    alt={`${existor.source} icon`}
                    className="mr-4"
                    style={{ width: '20px', height: '20px' }}
                  />
                )}
                <span className="mr-4">{existor.source}</span>
              </div>
              <div className="flex justify-end pr-4">
                <span>Exists</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};





