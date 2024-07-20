import {
  SheetContent,
  SheetHeader,
  Sheet,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import useCreateCategory from "../api/useCreateCategory";
import useOpenNewCategory from "../hooks/useOpenNewCategory";
import { CategoryForm } from "./categoryForm";

const NewCategorySheet = () => {
  const { isOpen, closeSheet } = useOpenNewCategory();

  const mutation = useCreateCategory();

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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm disabled={mutation.isPending} submit={submitFnHandler} defaultValues={{
          name: ""
        }} />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
