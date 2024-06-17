import BreadCrumb from '@/components/breadcrumb';
import React from 'react';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Case', link: '/dashboard/case' },
    { title: 'Create', link: '/dashboard/case/create' }
  ];
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
    </div>
  );
}
