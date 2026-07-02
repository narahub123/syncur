import { useToggleKeywordActiveMutation } from "@/features/keywords/hooks/useToggleKeywordActiveMutation";
import ConfirmDialog from "@/shared/components/common/ConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  keywordId: string;
  isActive: boolean;
};

const KeywordActiveToggleButton = ({ keywordId, isActive }: Props) => {
  const [open, setOpen] = useState(false);

  const mutation = useToggleKeywordActiveMutation();

  const handleConfirm = () => {
    mutation.mutate(
      {
        userKeywordId: keywordId,
        isActive: !isActive,
      },
      {
        onSuccess: () => {
          toast.success(isActive ? "비활성화 완료" : "활성화 완료");
          setOpen(false);
        },
        onError: () => {
          toast.error("처리 실패");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`키워드 ${isActive ? "비활성화" : "활성화"} 처리`}
        description={`키워드를 ${
          isActive ? "비활성화" : "활성화"
        }하시겠습니까?`}
        confirm={isActive ? "비활성화" : "활성화"}
        onConfirm={handleConfirm}
      />

      <button
        className={`shrink-0 rounded-md border px-3 py-1.5 text-sm ${
          isActive ? "text-red-500" : "text-green-600"
        }`}
        onClick={() => setOpen(true)}
      >
        {isActive ? "비활성화" : "활성화"}
      </button>
    </>
  );
};

export default KeywordActiveToggleButton;
