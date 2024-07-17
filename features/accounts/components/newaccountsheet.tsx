import {
  SheetContent,
  SheetHeader,
  Sheet,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import useOpenNewAccount from "../hooks/useOpenNewAccount";
import { AccountForm } from "./accountForm";
import useCreateAccount from "../api/useCreateAccount";

const NewAccountSheet = () => {
  const { isOpen, closeSheet } = useOpenNewAccount();

  const mutation = useCreateAccount();

  const submitFnHandler= (values: { name: string }) => {
     mutation.mutate(values, {
      onSuccess: () => {
        closeSheet();
      }
     })
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm disabled={mutation.isPending} submit={submitFnHandler} defaultValues={{
          name: ""
        }} />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
