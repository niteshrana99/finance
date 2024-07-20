import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormLabel, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

const schema = z.object({
  name: z.string()
});

type SchemaType = z.infer<typeof schema>;

interface IcategoriesFormProps {
  defaultValues?: SchemaType;
  submit: (values: SchemaType) => void;
  disabled: boolean;
  isEditMode?: boolean;
  onDelete?: () => void;
}

export const CategoryForm = ({
  defaultValues,
  submit,
  disabled,
  isEditMode,
  onDelete
}: IcategoriesFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  });

  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4 pt-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Category Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  disabled={disabled}
                  placeholder="eg. Shopping, Groceries"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full mt-12 space-y-4" disabled={disabled}>
          {isEditMode ? 'Update Category' : 'Create Category'}
        </Button>
        {isEditMode && (
          <Button
            className="w-full mt-12 space-y-4"
            variant="ghost"
            disabled={disabled}
            type='button'
            onClick={onDelete}>
            <Trash className="mr-2 size-4" /> Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};
