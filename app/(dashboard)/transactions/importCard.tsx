'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImportTable from './importTable';
import { useState } from 'react';
import { format } from 'date-fns';
import useSelectAccountModal from '@/hooks/useSelectAccountModal';
import useBulkCreateTransactions from '@/features/transactions/api/useBulkCreateTransactions';

interface IImportCardProps {
  data: string[][];
  onCancel: () => void;
}

interface SelectedValueInterface {
  [key: string] : string | null
}

const requiredOptions = ['amount', 'payee', 'date']

const ImportCard = ({ data, onCancel }: IImportCardProps) => {
  const headers = data[0];
  const body = data.slice(1);

  const [selectedColumns, setSelectedColumns] = useState<SelectedValueInterface>({});
  const [ AccountConfirmationModal, confirm ] = useSelectAccountModal();
  const { mutate: createBulkTransactionsMutation } = useBulkCreateTransactions();

  const onTableHeaderChange = (colIndex: number, value: string) => {
    setSelectedColumns((prev) => {
      let newResp = {...prev};
      if(value === 'Skip') {
        delete newResp[`col_${colIndex}`];
        return newResp
      }
      return {
        ...selectedColumns,
        [`col_${colIndex}`]: value
      }
    });
  }

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const createBulkTransactions = async () => {
    console.log(selectedColumns);
    const mappedSelectedColumns: any = {};
    for(let i in selectedColumns) {
      const index = Number(i.split("_")[1]);
      if(selectedColumns[i]) {
        mappedSelectedColumns[selectedColumns[i]] = index;
      }
    }
    console.log(mappedSelectedColumns)
    const formattedData = body.reduce((acc: any, current: any) => {
      acc.push({
        amount: current[mappedSelectedColumns['amount']],
        payee: current[mappedSelectedColumns['payee']],
        date: format(current[mappedSelectedColumns['date']], 'yyyy-MM-dd')
      });
      return acc;
    }, []);

    const ok: any = await confirm();
    createBulkTransactionsMutation({
      json: {
        account: ok,
        transactions: formattedData
      }
    }, {
      onSuccess: (d: any) => {
        onCancel();
      }
    })
  }

  return (
    <Card className="max-w-screen-2xl mx-auto pb-10 w-full -mt-28">
      <AccountConfirmationModal />
      <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:justify-between lg:items-center">
        <CardTitle className="text-xl">Transactions History</CardTitle>
        <div className="lg:flex lg:items-center lg:gap-x-2">
          <Button onClick={onCancel} size="sm" className="w-full">
            Cancel
          </Button>
          <Button onClick={createBulkTransactions} size="sm" className="w-full" disabled={progress < requiredOptions.length}>
            Continue ({`${progress} / ${requiredOptions.length}`})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ImportTable selectedColumns={selectedColumns} onTableHeaderChange={onTableHeaderChange} headers={headers} body={body} />
      </CardContent>
    </Card>
  );
};

export default ImportCard;
