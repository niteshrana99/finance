'use client';

import DataTable from '@/components/dataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useOpenNewAccount from '@/features/accounts/hooks/useOpenNewAccount';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { useGetAccounts } from '@/features/accounts/api/useGetAccounts';
import { SkeletonCard } from '@/components/skeletonCard';
import useDeleteAccounts from '@/features/accounts/api/useDeleteAccounts';
import { Row } from '@tanstack/react-table';

const AccountsPage = () => {
  const { openSheet } = useOpenNewAccount();
  const { data, isLoading } = useGetAccounts();
  const { mutate, isPending } = useDeleteAccounts();
  const disabled = isLoading || isPending;

  return (
    <Card className="max-w-screen-2xl mx-auto pb-10 w-full -mt-28">
      <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:justify-between lg:items-center">
        <CardTitle className="text-xl">Accounts Page</CardTitle>
        <Button onClick={openSheet}>
          <Plus /> Add New
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || isPending ? (
          <SkeletonCard />
        ) : (
          <DataTable 
          onDelete={(rows) => {
            const ids = rows.map(r => r.original.id);
            mutate({ids});
          }} 
          filterKey="name" 
          columns={columns} 
          data={data || []}
          disabled={disabled} />
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsPage;
