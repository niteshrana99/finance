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
import useModifyAccount from "../api/useModifyAccount";
import useDeleteSingleAccount from "../api/useDeleteSingleAccount";

const EditAccountSheet = () => {
  const { isOpen, closeSheet, id } = useEditAccount();

  const { isLoading, data } = useGetAccount(id);

  const mutation = useModifyAccount({ id: id.toString() });
  const { isPending } = mutation;

  const deleteMutation = useDeleteSingleAccount();

  const { isPending: isDeletePending } = deleteMutation;

  const submitFnHandler= (values: { name: string }) => {
    mutation.mutate(values, {
        onSuccess: () => {
            closeSheet();
        }
    })
  }

  const onDeleteHandler = () => {
    deleteMutation.mutate({ param: { id: id.toString() } }, {
        onSuccess: () => {
            closeSheet();
        }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Edit to track your transactions.
          </SheetDescription>
        </SheetHeader>
        {id && isLoading ? <Loader2 /> : <AccountForm onDelete={onDeleteHandler} isEditMode={true} disabled={isPending || isDeletePending} submit={submitFnHandler} defaultValues={{
          name: data?.name || ''
        }} /> }
      </SheetContent>
    </Sheet>
  );
};

export default EditAccountSheet;
