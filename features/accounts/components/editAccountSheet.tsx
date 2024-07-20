"use client";

import {
  SheetContent,
  SheetHeader,
  Sheet,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AccountForm } from "./accountForm";
import { useGetAccount } from "../api/useGetAccount";
import { Loader2 } from "lucide-react";
import useEditAccount from "../hooks/useEditAccount";

const EditAccountSheet = () => {
  const { isOpen, closeSheet, id } = useEditAccount();

  const { isLoading, data } = useGetAccount(id);

  const submitFnHandler= (values: { name: string }) => {

  }

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Edit your account to easily track your transactions.
          </SheetDescription>
        </SheetHeader>
        {id && isLoading ? <Loader2 /> : <AccountForm disabled={false} submit={submitFnHandler} defaultValues={{
          name: data?.name || ''
        }} /> }
      </SheetContent>
    </Sheet>
  );
};

export default EditAccountSheet;
