import { useGetAccounts } from '@/features/accounts/api/useGetAccounts';
import { Button } from '@/components/ui/button';
import Select from '@/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { SetStateAction, useRef, useState } from 'react';
import { toast } from 'sonner';
import useCreateAccount from '@/features/accounts/api/useCreateAccount';

const useSelectAccountModal = () : [() => JSX.Element, () => Promise<unknown>] => {
  const { data: accounts } = useGetAccounts();

  const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | undefined>(undefined);

  const selectedValue = useRef<string | undefined>(undefined)
  const accountMutation = useCreateAccount();

  const accountsOption = accounts?.map((acc) => ({
    label: acc.name,
    value: acc.id
  }));

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve })
  })

  const onAccountSelection = (value: any) => {
    console.log(selectedValue.current);
    selectedValue.current = value;
  };

  const buttonOnClose = () => {
    promise?.resolve(undefined);
    setPromise(undefined);
  }

  const onConfirm = () => {
    if(!selectedValue.current) {
      toast.error("Please select an account");
      return;
    }
    promise?.resolve(selectedValue.current);
    setPromise(undefined);
  }

  const createNewAccount = (accountName: string) => {
    accountMutation.mutate(
      { name: accountName },
      {
        onSuccess: () => {
          toast.success('New Account created Successfully');
        }
      }
    );
  };

  const AccountConfirmationModal = () => {
    return (
      <Dialog open={!!promise}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please select an account</DialogTitle>
            <DialogDescription>
              These transactions will be mapped to the account you select
            </DialogDescription>
          </DialogHeader>
          <div>
            <Select
              options={accountsOption}
              placeholder="Select or create an account"
              onChange={onAccountSelection}
              onCreate={createNewAccount}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={buttonOnClose}>
              Close
            </Button>
            <Button type="button" onClick={onConfirm} disabled={accountMutation.isPending} >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [AccountConfirmationModal, confirm]
};

export default useSelectAccountModal;
