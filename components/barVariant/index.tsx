import { format } from 'date-fns';
import { Tooltip, XAxis, BarChart, ResponsiveContainer, CartesianGrid, Bar } from 'recharts';
import CustomTooltip from '../customTooltip';

interface IAreaVariantProps {
  data?:
    | {
        date: string;
        income: number;
        expenses: number;
      }[]
    | undefined;
}

export const Barvariant = ({ data }: IAreaVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="income" fill="#3b82f6" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  );
};