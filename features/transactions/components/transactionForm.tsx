import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, Form } from '@/components/ui/form';
import { z } from 'zod';
import Select from '@/components/select';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/datepicker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AmountInput from '@/components/amountInput';

const SelectDropdownSchema = z.object({
  label: z.string(),
  value: z.number()
});

const schema = z.object({
  category: SelectDropdownSchema,
  account: SelectDropdownSchema,
  date: z.date(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().optional()
});

interface ITransactionForm {
  accounts: z.infer<typeof SelectDropdownSchema>[] | [];
  categories: z.infer<typeof SelectDropdownSchema>[] | [];
  onCrateNewAccount: (value: string) => void;
  onCreateNewCategory: (value: string) => void;
  disabled: boolean;
}

const TransactionForm = ({
  accounts,
  categories,
  onCrateNewAccount,
  onCreateNewCategory,
  disabled
}: ITransactionForm) => {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const { control, handleSubmit } = form;

  const createTransactionCTA = (value: any) => {
    console.log(value);
  };

  const onSubmit = handleSubmit(createTransactionCTA, (errors) => {
    console.log('Form errors:', errors);
  });

  return (
    <Form {...form}>
      <form className="space-y-4 pt-4" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="date"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <DatePicker value={field.value} onChange={field.onChange} disabled={disabled} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="account"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  options={accounts}
                  placeholder="Select or create an account"
                  onCreate={onCrateNewAccount}
                  value={field.value}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="category"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  options={categories}
                  placeholder="Select or create a category"
                  onCreate={onCreateNewCategory}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="payee"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Add a payee" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="amount"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="notes"
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea disabled={disabled} placeholder="Optional Notes" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-12 space-y-4" disabled={disabled}>
          Create Transaction
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
