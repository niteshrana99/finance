'use client';

import DataTable from '@/components/dataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { SkeletonCard } from '@/components/skeletonCard';
import useNewTransaction from '@/features/transactions/hooks/use-new-transaction';
import useGetTransactions from '@/features/transactions/api/useGetTransactions';
import useBulkDeleteTransactions from '@/features/transactions/api/useBulkDeleteTransactions';

const TrnsactionsPage = () => {
  const { openSheet } = useNewTransaction();
  const { data, isLoading } = useGetTransactions();
  const { mutate, isPending } = useBulkDeleteTransactions();
  const disabled = isLoading || isPending;

  return (
    <Card className="max-w-screen-2xl mx-auto pb-10 w-full -mt-28">
      <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:justify-between lg:items-center">
        <CardTitle className="text-xl">Trnsactions History</CardTitle>
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
            mutate({json: {ids}});
          }} 
          filterKey="payee" 
          columns={columns} 
          data={data || []}
          disabled={disabled} />
        )}
      </CardContent>
    </Card>
  );
};

export default TrnsactionsPage;
