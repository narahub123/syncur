import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

const CollectionDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>collection modal</DialogTitle>

          <DialogDescription>설명</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto"></div>

        <DialogFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          푸터
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDialog;
