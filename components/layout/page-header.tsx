'use client';

import React from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  title: string;
  link: string;
}

interface PageHeaderProps {
  breadcrumbItems: BreadcrumbItem[];
  button?: {
    link: string;
    text: string;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumbItems, button }) => {
  return (
    <header className="py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
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
        {button && (
          <Link
            href={button.link}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {button.text}
          </Link>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
