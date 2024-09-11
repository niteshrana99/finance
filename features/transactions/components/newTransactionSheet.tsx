import {
  SheetContent,
  SheetHeader,
  Sheet,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import useNewTransaction from '../hooks/use-new-transaction';
import TransactionForm from './transactionForm';
import { useGetAccounts } from '@/features/accounts/api/useGetAccounts';
import { useGetCategories } from '@/features/categories/api/useGetCategories';
import { Loader2 } from 'lucide-react';
import useCreateAccount from '@/features/accounts/api/useCreateAccount';
import useCreateCategory from '@/features/categories/api/useCreateCategory';
import { toast } from 'sonner';
import useCreateNewTransaction from '../api/useCreateNewTransaction';
import { z } from 'zod';

const SelectDropdownSchema = z.object({
  label: z.string(),
  value: z.number()
});

const schema = z.object({
  category: SelectDropdownSchema,
  account: SelectDropdownSchema,
  date: z.string().date(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().optional()
});

const NewTransactionSheet = () => {
  const { isOpen, closeSheet } = useNewTransaction();
  const { data: accountsData, isLoading: isAccountsLoading } = useGetAccounts();

  const accountsOption = accountsData?.map((category) => ({
    label: category.name,
    value: category.id
  }));

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategories();

  const categoriesOption = categoriesData?.map((category) => ({
    label: category.name,
    value: category.id
  }));

  const accountMutation = useCreateAccount();
  const categoryMutation = useCreateCategory();
  const createTransactionMutation = useCreateNewTransaction();

  const createTransactionCTA = (value: any) => {
    createTransactionMutation.mutate(value, {
      onSuccess: () => {
        closeSheet();
      },
      onError: () => {
        toast('Transaction creation Failed. Please try again');
      }
    });
  };

  const disabled =
    accountMutation.isPending || categoryMutation.isPending || createTransactionMutation.isPending;

  const createNewAccount = (accountName: string) => {
    accountMutation.mutate(
      { name: accountName },
      {
        onSuccess: () => {
          console.log(accountsOption);
          toast.success('New Account created Successfully');
        }
      }
    );
  };

  const createNewCategory = (categoryName: string) => {
    categoryMutation.mutate(
      { name: categoryName },
      {
        onSuccess: () => {
          toast.success('New Category created Successfully');
        }
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new Transaction.</SheetDescription>
        </SheetHeader>
        {isAccountsLoading || isCategoriesLoading ? (
          <Loader2 />
        ) : (
          <TransactionForm
            accounts={accountsOption || []}
            categories={categoriesOption || []}
            onCrateNewAccount={createNewAccount}
            onCreateNewCategory={createNewCategory}
            disabled={disabled}
            createTransaction={createTransactionCTA}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;
