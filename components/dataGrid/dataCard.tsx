import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { IconType } from 'react-icons/lib';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import CountUp from 'react-countup';

const iconVariant = cva('size-6', {
  variants: {
    variant: {
      default: 'fill-blue-500',
      success: 'fill-emerald-500',
      danger: 'fill-rose-500',
      warning: 'fill-yellow-500'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const boxVariant = cva('rounded-md p-3 shrink-0', {
  variants: {
    variant: {
      default: 'bg-blue-500/20',
      success: 'bg-emerald-500/20',
      danger: 'bg-rose-500/20',
      warning: 'bg-yellow-500/20'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface iInterfaceDataCardProps extends BoxVariants, IconVariants {
  title: string;
  value: number | undefined;
  percentageChange: number | undefined;
  icon: IconType;
  dateRange: string;
}

const DataCard = ({
  title,
  value = 0,
  percentageChange = 0,
  icon: Icon,
  variant,
  dateRange
}: iInterfaceDataCardProps) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-4">
          <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{dateRange}</CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
      <div>
        <h1 className='text-2xl font-bold mb-2 line-clamp-1'>
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimalPlaces={2}
            formattingFn={formatCurrency}
            />
            </h1>
            <p className={cn('text-muted-foreground line-clamp-1 text-sm', 
                percentageChange > 0 && 'text-emerald-500',
                percentageChange < 0 && 'text-rose-500'
            )}>
                {formatPercentage(percentageChange, true)} from last period
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
