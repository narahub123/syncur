import { useDeleteKeywordMutation } from "@/features/keywords/hooks/useDeleteKeywordMutation";
import ConfirmDialog from "@/shared/components/common/ConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  keywordId: string;
};

const KeywordDeleteButton = ({ keywordId }: Props) => {
  const [open, setOpen] = useState(false);

  const deleteMutation = useDeleteKeywordMutation();

  const handleConfirm = () => {
    deleteMutation.mutate(keywordId, {
      onSuccess: () => {
        toast.success("키워드가 삭제되었습니다.");
        setOpen(false);
      },
      onError: () => {
        toast.error("키워드 삭제에 실패했습니다.");
      },
    });
  };

  return (
    <>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={"키워드 삭제 처리"}
        description={"키워드를 삭제하시겠습니까?"}
        confirm={"삭제"}
        onConfirm={handleConfirm}
      />
      <button
        className="shrink-0 rounded-md border px-3 py-1.5 text-sm text-red-500"
        onClick={() => setOpen(true)}
      >
        삭제
      </button>
    </>
  );
};

export default KeywordDeleteButton;
