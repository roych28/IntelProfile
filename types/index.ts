import { Icons } from '@/components/icons';

export interface Identifier {
  id: string;
  case_id: string;
  type: string;
  query: string;
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

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
