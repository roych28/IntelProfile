import { Icons } from '@/components/icons';

export interface Identifier {
  id: string;
  case_id: string;
  type: string;
  query: string;
  results?: any;
}

export const searchTypes: string[] = [
  'Email',
  'Phone Number',
  'Username',
  'Fullname',
  'Social URL',
  'Telegram ID',
  'Reverse Image',
  'Face and Name',
];

export type Case = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  identifiers?: any;
};

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface IdentifierDetails {
  id: string;
  query: string;
  type: string;
  created_at: string;
  results?: {
    data?: {
      status: string;
      profiles?: Profile[];
      leaks?: Leak[];
      pictures?: {
        picture: string;
        source: string;
      }[];
    };
  }[];
}

export interface Profile {
  source: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  profile_pic: string;
}

export interface Leak {
  title: string;
  date: number;
  url: string;
}

export interface CaseDetails {
  name: string;
  identifiers?: IdentifierDetails[];
}

export interface MergedData {
  [key: string]: Profile & { count: number };
}

export type StatsData = {
  sourcesScanned: number;
  names: number;
  usernames: number;
  totalAccounts: number;
  countries: number;
};

export const identifierImages: Record<string, string> = {
  'email': '/email.jpg',
  'phone': '/phone.jpg',
  'username': '/username.jpg',
  'fullname': '/fullname.jpg',
  'socialurl': '/social-url.jpg',
  'telegramid': '/telegram.jpg',
  'reverseimage': '/reverse-image.jpg',
  'facename': '/face-and-name.jpg',
};

