import { Edit, Loader2, MoreHorizontal, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useEditAccount from '@/features/accounts/hooks/useEditAccount';
import useDeleteSingleAccount from '@/features/accounts/api/useDeleteSingleAccount';
import useConfirmModal from '@/hooks/useConfirmModal';

export default function Action({ id }: { id: number }) {
  const { openSheet } = useEditAccount();
  const [ ConfirmDialog, confirm ] = useConfirmModal({
    title: 'Are you absolutely sure?',
    description: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
  });

  const { mutate, isPending } = useDeleteSingleAccount();

  const openEditSheet = () => {
    openSheet(id);
  };

  const deleteAccountHandler = async () => {
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
        <DropdownMenuItem onClick={deleteAccountHandler}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}
