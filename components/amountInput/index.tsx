import CurrencyInput from 'react-currency-input-field';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IAmountInputProps {
  value: string;
  disabled: boolean;
  placeholder: string;
  onChange: (value: string | undefined | null) => void;
}

const AmountInput = ({ value, disabled, placeholder, onChange }: IAmountInputProps) => {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const reverseValue = () => {
    const newValue = parseFloat(value) * -1;
    onChange(newValue.toString());
  };

  return (
    <div className="relative">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'bg-slate-400 hover:bg-slate-500 absolute rounded-md-2',
                isIncome && 'bg-emerald-500 hover:bg-emerald-600',
                isExpense && 'bg-rose-500 hover:bg-rose-600'
              )}
              onClick={reverseValue}>
              {!parsedValue && <Info className="size-3 text-white" />}
              {isIncome && <PlusCircle className="size-3 text-white" />}
              {isExpense && <MinusCircle className="size-3 text-white" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Use [+] for income and [-] for expenses.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        className="pl-14 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 p-8"
        placeholder={placeholder}
        disabled={disabled}
        decimalsLimit={2}
        prefix="₹"
        value={value}
        defaultValue={0}
        onValueChange={onChange}
      />
      <p className="text-xs pt-1 text-muted-foreground">
        {isIncome && 'This will count as income'}
        {isExpense && 'This will count as expense'}
      </p>
    </div>
  );
};

export default AmountInput;
