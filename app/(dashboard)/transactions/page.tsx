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
import { useState } from 'react';
import UploadButton from './uploadButton';
import ImportCard from './importCard';

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  erros: [],
  meta: {}
}

const TrnsactionsPage = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResult, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const { openSheet } = useNewTransaction();
  const { data, isLoading } = useGetTransactions();
  const { mutate, isPending } = useBulkDeleteTransactions();
  const disabled = isLoading || isPending;

  const getList = () => {
    return isLoading || isPending ? (
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
    )
  }

  const onUploadSuccess = (data: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(data);
    setVariant(VARIANTS.IMPORT)
  }

  const onUploadCancel = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST)
  }

  if(variant === VARIANTS.IMPORT) {
    return (
      <ImportCard data={importResult.data} onCancel={onUploadCancel} />
    )
  }

  return (
    <Card className="max-w-screen-2xl mx-auto pb-10 w-full -mt-28">
      <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:justify-between lg:items-center">
        <CardTitle className="text-xl">Transactions History</CardTitle>
        <div className='lg:flex lg:items-center lg:gap-x-2'>
        <Button onClick={openSheet} size="sm" className='w-full'>
          <Plus /> Add New
        </Button>
        <UploadButton onUpload={onUploadSuccess} />
        </div>
      </CardHeader>
      <CardContent>
        { variant === VARIANTS.LIST && getList() }
      </CardContent>
    </Card>
  );
};

export default TrnsactionsPage;
