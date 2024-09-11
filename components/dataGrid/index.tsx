import useGetSummary from '@/features/summary/api/useGetSummary';
import { formatDateRange } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { FaPiggyBank } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import DataCard from '@/components/dataGrid/dataCard';
import { Skeleton } from "@/components/ui/skeleton"

const DataGrid = () => {
  const params = useSearchParams();
  const { data, isLoading } = useGetSummary();
  const to = params.get('to') || undefined;
  const from = params.get('from') || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  if(isLoading) {
    return <SkeletonCard />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 pb-2">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomesChange}
        icon={FaArrowTrendUp}
        variant="success"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};


export function SkeletonCard() {
  return (
    <div className="flex flex-row justify-between">
      {[1, 2, 3].map((d) => <div key={d} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 pb-2">
      <Skeleton className="h-[200px] w-[490px] rounded-xl" />
      </div>
      )}
      
    </div>
  )
}


export default DataGrid;
