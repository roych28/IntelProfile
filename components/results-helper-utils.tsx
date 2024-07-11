import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Timeline from '@/components/ui/timeline';
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, PersonIcon, GroupIcon, GlobeIcon, DownloadIcon, AvatarIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Leak, Identifier, Profile, StatsData, identifierImages, Existor, Email, Phone, Picture } from '@/types';
import { iconMap } from '@/constants/data';
import { Table, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

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

export const renderStatsCards = (data: StatsData | null): JSX.Element => {

  if(!data) 
    return <> </>;

  return (
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
          <AvatarIcon className="text-lg mr-2" />
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
};

export const renderLeaks = (leaks: Leak[] | undefined): JSX.Element => {
  if(leaks?.length === 0) return <></>;
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Breached Accounts</CardTitle>
        <p className="">List of detected compromised accounts.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {leaks?.map((leak, index) => (
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

  if(leaks.length === 0) return <></>;

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

export const renderSummary = (details: Identifier): JSX.Element => {
  const createdAtDates = details?.created_at.split(',').map(date => date.trim());
  const queriesData = details?.query.split(',').map(item => item.trim());
  const typesData = details?.type.split(',').map(item => item.trim());
  const statusData = details?.status.split(',').map(item => item.trim());

  return (
    <Card className="custom-card">
      <CardContent className="card-header pb-2">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell scope="row">Query</TableCell>
              {queriesData?.map((query, index) => (
                <TableCell key={index}>{query}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell scope="row">Type</TableCell>
              {typesData?.map((type, index) => (
                <TableCell key={index}>{type}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell scope="row">Status</TableCell>
              {statusData?.map((status, index) => (
                <TableCell key={index}>{status}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell scope="row">Created At</TableCell>
              {createdAtDates?.map((createdAt, index) => (
                <TableCell key={index}>{new Date(createdAt).toLocaleString()}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


export const renderPartialRecoveryData = (partialRecovery: any[] | undefined): JSX.Element => {

  if(partialRecovery?.length === 0) return <></>;
  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Partial Recovery Data</CardTitle>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul>
          {partialRecovery?.map((item, index) => (
            <li
              key={index}
              className={`flex flex-row justify-between items-center mb-3 ${index !== partialRecovery.length - 1 ? 'item-divider border-b border-gray-700' : ''}`}
            >
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

export const renderPasswords = (passwords: any[] | undefined): JSX.Element => {

  if(passwords?.length === 0) return <></>;

  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Passwords</CardTitle>
        <p className="">List of detected passwords.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {passwords?.map((password, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center mb-3 item-divider"
              style={index === passwords?.length - 1 ? { borderBottom: 'none' } : {}}
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

export const renderPhones = (phones: any[] | undefined): JSX.Element => {

  if(phones?.length === 0) return <></>;

  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Phones</CardTitle>
        <p className="">List of detected phone numbers.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {phones?.map((phone, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center mb-3 item-divider"
              style={index === phones?.length - 1 ? { borderBottom: 'none' } : {}}
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

export const renderExistors = (existors: Existor[] | undefined, profiles: Profile[] | undefined, emails: Email[] | undefined, phones: Phone[] | undefined, pictures: Picture[] | undefined) => {
  const filteredExistors = existors?.filter(existor => existor.exists);
  if( filteredExistors?.length === 0 ) return <></>;;

  return (
    <Card className="custom-card">
      <CardHeader className="card-header pb-2">
        <CardTitle className="text-lg font-semibold">Existors</CardTitle>
        <p className="">List of sources where the account exists.</p>
      </CardHeader>
      <hr className="title-underline" />
      <CardContent>
        <ul className="list-unstyled">
          {filteredExistors?.map((existor, index) => {
            const profile = profiles?.find(p => p.source === existor.source) || null;
            const email = emails?.find(e => e.source === existor.source) || null;
            const phone = phones?.find(p => p.source === existor.source) || null;
            const picture = pictures?.find(p => p.source === existor.source) || null;

            return (
              <li
                key={index}
                className={`flex flex-row justify-between items-center mb-3 ${index !== filteredExistors.length - 1 ? 'item-divider border-b border-gray-700' : ''}`}
              >
                <div className="flex flex-row pl-4">
                  {existor && iconMap[existor.source] && (
                    <img
                      src={iconMap[existor.source]}
                      alt={`${existor.source} icon`}
                      className="mr-4"
                      style={{ width: '40px', height: '40px' }}
                    />
                  )}
                  <div className="flex flex-col">
                    {profile?.url && (
                      <a href={profile.url} className="text-blue-500 underline">{profile?.url}</a>
                    )}
                    <span className="text-gray-500">{`Source: ${existor?.source}`}</span>
                    {email?.email && (
                      <span className="text-gray-500">{`Email: ${email.email}`}</span>
                    )}
                    {phone?.number && (
                      <span className="text-gray-500">{`Phone: ${phone?.number}`}</span>
                    )}
                    {(profile?.firstname || profile?.lastname) && (
                      <span className="text-gray-500">{`Name: ${profile.firstname || ''} ${profile.lastname || ''}`}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end pr-4">
                  {picture?.picture && (
                    <img src={picture.picture} alt="Profile" className="w-10 h-10 rounded-full" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};










