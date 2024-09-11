import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import ImportHeaderSelect from './import-header-select';

interface IImportTableProps {
  headers: string[];
  body: any;
  onTableHeaderChange: any
  selectedColumns: Record<string, string | null>
}

const ImportTable = ({ headers, body, onTableHeaderChange, selectedColumns }: IImportTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((item: string, index: number) => (
            <TableHead key={index}>
            <ImportHeaderSelect colIndex={index} onTableHeaderChange={onTableHeaderChange} selectedColumns={selectedColumns}  />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {body.map((item: string[], index: number) => (
          <TableRow key={index}>
            {item.map((columnValue: string, rowNumber: number) => (
              <TableCell key={rowNumber}>{columnValue}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ImportTable;
