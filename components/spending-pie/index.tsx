import { FileSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useState } from 'react';
import * as React from 'react';

import { PieVariant } from '../pieVariant';

interface IChartProps {
  data?:
    {
        name: string;
        total: number;
      }[]
    | undefined;
}

const SpendingPie = ({ data = [] }: IChartProps) => {
  const [chartType, setChartType] = useState('pie');

  const onTypeChange = (value: string) => {
    setChartType(value);
  };

  return (
    <Card className="border-none drop-shadow-md">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No data for this period.</p>
          </div>
        ) : (
          <div>
            <PieVariant data={data} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingPie;
