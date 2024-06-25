import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface BreadcrumbItem {
  title: string;
  link: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <Breadcrumb>
    <BreadcrumbList>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={item.link} prefetch={false}>
                {item.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index < items.length - 1 && (
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          )}
        </React.Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);

export default Breadcrumbs;
