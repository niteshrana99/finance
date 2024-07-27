import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, Form } from '@/components/ui/form';
import { z } from 'zod';
import Select from '@/components/select';
import { Button } from '@/components/ui/button';

const SelectDropdownSchema = z.object({
  label: z.string(),
  value: z.number()
});

const schema = z.object({
  category: z.array(SelectDropdownSchema),
  account: z.array(SelectDropdownSchema)
});

interface ITransactionForm {
  accounts: z.infer<typeof SelectDropdownSchema>[] | [];
  categories: z.infer<typeof SelectDropdownSchema>[] | [];
  onCrateNewAccount: (value: string) => void;
  onCreateNewCategory: (value: string) => void;
  disabled: boolean
}

const TransactionForm = ({ accounts, categories, onCrateNewAccount, onCreateNewCategory, disabled }: ITransactionForm) => {
  const form = useForm({
    resolver: zodResolver(schema)
  });

  const { control } = form;

  return (
    <Form {...form}>
      <form className="space-y-4 pt-4">
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
        <Button className="w-full mt-12 space-y-4" disabled={disabled}>
          Create Transaction
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
