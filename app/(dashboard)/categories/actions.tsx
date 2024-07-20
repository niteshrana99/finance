import { Edit, Loader2, MoreHorizontal, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useConfirmModal from '@/hooks/useConfirmModal';
import useEditCategory from '@/features/categories/hooks/useEditCategory';
import useDeleteSingleCategory from '@/features/categories/api/useDeleteSingleCategory';

export default function Action({ id }: { id: number }) {
  const { openSheet } = useEditCategory();
  const [ ConfirmDialog, confirm ] = useConfirmModal({
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete your category and remove your data from our servers.'
  });

  const { mutate, isPending } = useDeleteSingleCategory();

  const openEditSheet = () => {
    openSheet(id);
  };

  const deleteCategoryHandler = async () => {
    const ok = await confirm();
    if(ok) {
      mutate({ param: { id: id.toString() } });
    }
    
  }

  if(isPending) {
   return <Loader2 />
  }

  return (
    <>
    <ConfirmDialog />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-16">
        <DropdownMenuItem onClick={openEditSheet}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteCategoryHandler}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}
