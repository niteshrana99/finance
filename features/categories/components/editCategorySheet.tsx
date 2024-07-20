"use client";

import {
  SheetContent,
  SheetHeader,
  Sheet,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import useEditCategory from "../hooks/useEditCategory";
import { useGetCategory } from "../api/useGetCategory";
import useModifyCategories from "../api/useModifyCategories";
import useDeleteSingleCategory from "../api/useDeleteSingleCategory";
import { CategoryForm } from "./categoryForm";

const EditCategorySheet = () => {
  const { isOpen, closeSheet, id } = useEditCategory();

  const { isLoading, data } = useGetCategory(id);

  const mutation = useModifyCategories({ id: id.toString() });
  const { isPending } = mutation;

  const deleteMutation = useDeleteSingleCategory();

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
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>
            Edit to track your transactions.
          </SheetDescription>
        </SheetHeader>
        {id && isLoading ? <Loader2 /> : <CategoryForm onDelete={onDeleteHandler} isEditMode={true} disabled={isPending || isDeletePending} submit={submitFnHandler} defaultValues={{
          name: data?.name || ''
        }} /> }
      </SheetContent>
    </Sheet>
  );
};

export default EditCategorySheet;
