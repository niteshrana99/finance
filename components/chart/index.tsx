import { FileSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AreaVariant from '../areaVariant';
import { Barvariant } from '../barVariant';
import { Linevariant } from '../lineVariant';
import { useState } from 'react';
import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface IChartProps {
  data?:
    | {
        date: string;
        income: number;
        expenses: number;
      }[]
    | undefined;
}

const Chart = ({ data = [] }: IChartProps) => {
  const [chartType, setChartType] = useState('area');

  const onTypeChange = (value: string) => {
    setChartType(value);
  };

  return (
    <Card className="border-none drop-shadow-md">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Select onValueChange={onTypeChange} defaultValue='area'>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a chart" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a chart</SelectLabel>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">No data for this period.</p>
          </div>
        ) : (
          <div>
            {chartType === 'area' && <AreaVariant data={data} /> }
            {chartType === 'bar' && <Barvariant data={data} /> }
            {chartType === 'line' && <Linevariant data={data} /> }
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Chart;
