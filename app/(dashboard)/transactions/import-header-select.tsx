import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const options = ['amount', 'payee', 'date'];

const ImportHeaderSelect = ({ onTableHeaderChange, selectedColumns, colIndex }: any) => {
  const currentSelection = selectedColumns[`col_${colIndex}`]
  return (
    <Select value={currentSelection || ''} onValueChange={(value) => onTableHeaderChange(colIndex, value)}>
      <SelectTrigger
        className={cn(
          'border-none focus:ring-offset-0 focus:ring-transparent outline-none bg-transparent capitalize', currentSelection && "text-blue-500"
        )}>
        <SelectValue placeholder={'Skip'} />
      </SelectTrigger>
      <SelectContent>
      <SelectItem value={'Skip'}>Skip</SelectItem>
        {options.map((item, index) => {
          const disabled = Object.values(selectedColumns).indexOf(item) > -1;
          return (
            <SelectItem key={index} value={item} disabled={disabled}>
              {item}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ImportHeaderSelect;
