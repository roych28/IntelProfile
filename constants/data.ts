//import { Icons } from '@/components/icons';
import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const iconMap: { [key: string]: string } = {
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  goodreads: "https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png",
  facebook: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  github: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  dropbox: "https://cdn.worldvectorlogo.com/logos/dropbox-1.svg",
  linkedin: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  twitter: "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  tiktok: "https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg",
  snapchat: "https://upload.wikimedia.org/wikipedia/commons/9/98/Snapchat_Logo.png",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  trello: "https://cdn.worldvectorlogo.com/logos/trello.svg",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  pinterest: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Pinterest_Logo.png",
  reddit: "https://upload.wikimedia.org/wikipedia/en/8/82/Reddit_logo_and_wordmark.svg",
  steam: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
  whatsapp: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  youtube: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png",
  twitch: "https://upload.wikimedia.org/wikipedia/commons/2/26/Twitch_logo.svg",
  discord: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Font_Awesome_5_brands_discord_color.svg",
  slack: "https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png",
  medium: "https://cdn.worldvectorlogo.com/logos/medium-1.svg",
  telegram: "https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg",
  ebay: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/6/62/Amazon.com-Logo.svg",
  paypal: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
  airbnb: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
  uber: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Uber_logo_2018.svg",
  lyft: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Lyft_logo13.svg",
  grubhub: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Grubhub_logo.svg",
  playgames: "https://www.gstatic.com/images/branding/product/1x/play_games_64dp.png",
  maps: "https://www.gstatic.com/images/branding/product/1x/maps_64dp.png",
  hibp: "https://haveibeenpwned.com/Content/Images/SocialLogo.png",
  skype: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Skype_logo_(2019%E2%80%93present).svg",
  zoom: "https://upload.wikimedia.org/wikipedia/commons/7/72/Zoom_Communications_Logo.svg",
  outlook: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Outlook.com_icon.svg",
  yahoo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Yahoo%21_logo.svg",
};

export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  /*{
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },*/
  {
    title: 'Search',
    href: '/dashboard/search',
    icon: 'Search',
    label: 'Profile Intelligence'
  },
  /*{
    title: 'User',
    href: '/dashboard/user',
    icon: 'user',
    label: 'user'
  },*/
  {
    title: 'Cases',
    href: '/dashboard/cases',
    icon: 'employee',
    label: 'employee'
  },
  /*{
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'profile'
  },
  /*{
    title: 'Kanban',
    href: '/dashboard/kanban',
    icon: 'kanban',
    label: 'kanban'
  },*/
  /*{
    title: 'Login',
    href: '/',
    icon: 'login',
    label: 'login'
  }*/
];
