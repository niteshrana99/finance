import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';

interface IuseConfirmDialogProps {
  title: string;
  description: string;
}

const useConfirmModal = ({
  title,
  description
}: IuseConfirmDialogProps): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{resolve: (value: boolean) => void} | null>(null);

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve })
  });

  const handleClose = () => {
    setPromise(null);
  }

  const handleconfirm = () => {
    promise?.resolve(true);
    handleClose();
  }

  const handlecancel = () => {
    promise?.resolve(false);
    handleClose();
  }
  const ConfirmDialog = () => {
    return (
      <Dialog open={promise !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handlecancel}>
              Close
            </Button>
            <Button type="button" onClick={handleconfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmDialog, confirm];
};

export default useConfirmModal;
