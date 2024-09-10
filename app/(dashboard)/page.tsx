'use client';

import DataCharts from '@/components/dataCharts';
import DataGrid from '@/components/dataGrid';

export default function DashboardPage() {

  return <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
    <DataGrid />
    <DataCharts />
  </div>;
}
