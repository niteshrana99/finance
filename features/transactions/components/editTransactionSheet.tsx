import {
  SheetContent,
  SheetHeader,
  Sheet,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import TransactionForm from './transactionForm';
import { useGetAccounts } from '@/features/accounts/api/useGetAccounts';
import { useGetCategories } from '@/features/categories/api/useGetCategories';
import { Loader2 } from 'lucide-react';
import useCreateAccount from '@/features/accounts/api/useCreateAccount';
import useCreateCategory from '@/features/categories/api/useCreateCategory';
import { toast } from 'sonner';
import useCreateNewTransaction from '../api/useCreateNewTransaction';
import { z } from 'zod';
import useEditTransaction from '@/features/categories/hooks/useEditTransaction';
import useGetTransactionById from '../api/useGetTransactionById';
import useEditTransactionData from '../api/useEditTransactionData';
import useConfirmModal from '@/hooks/useConfirmModal';
import useDeleteTransactionById from '../api/useDeleteTransactionById';

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

const EditTransactionSheet = () => {
  const { isOpen, closeSheet, id } = useEditTransaction();
  const { data: accountsData, isLoading: isAccountsLoading } = useGetAccounts();
  const [ConfirmDialog, confirm] = useConfirmModal({
    title: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. This will permanently delete your category and remove your data from our servers.'
  });

  const { data: transaction, isLoading: isTransactionLoading } = useGetTransactionById(id);
  console.log(transaction);

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
  const transactionMutation = useEditTransactionData(id);
  const deleteTransactionMutation = useDeleteTransactionById();

  const updateTransactionCTA = (value: z.infer<typeof schema>) => {
    transactionMutation.mutate(value, {
      onSuccess: () => {
        closeSheet();
      },
      onError: () => {
        toast('Transaction creation Failed. Please try again');
      }
    });
  };

  const disabled =
    accountMutation.isPending ||
    categoryMutation.isPending ||
    transactionMutation.isPending ||
    deleteTransactionMutation.isPending;

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

  const onDeleteTransactionCTA = async () => {
      deleteTransactionMutation.mutate({ param: { id: id.toString() } }, {
        onSuccess: () => {
          closeSheet();
        }
      });
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>Edit an existeing transaction.</SheetDescription>
        </SheetHeader>
        {isAccountsLoading || isCategoriesLoading || isTransactionLoading ? (
          <Loader2 />
        ) : (
          <TransactionForm
            accounts={accountsOption || []}
            categories={categoriesOption || []}
            onCrateNewAccount={createNewAccount}
            onCreateNewCategory={createNewCategory}
            disabled={disabled}
            createTransaction={updateTransactionCTA}
            isEditMode={true}
            transaction={transaction}
            onDelete={onDeleteTransactionCTA}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditTransactionSheet;
