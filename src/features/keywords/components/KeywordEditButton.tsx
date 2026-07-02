"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateKeywordMutation } from "../hooks/useUpdateKeywordMutation";
import { ROUTES } from "@/shared/constants/routes";

type Props = {
  userKeywordId: string;
  displayKeyword: string;
  keyword: string;
  subscriptionIds: string[];
};

const KeywordSaveButton = ({
  userKeywordId,
  displayKeyword,
  keyword,
  subscriptionIds,
}: Props) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateKeywordMutation();

  const handleSave = () => {
    mutate(
      {
        userKeywordId,
        displayKeyword,
        keyword,
        subscriptionIds,
      },
      {
        onSuccess: () => {
          toast.success("키워드가 수정되었습니다.");
          router.push(ROUTES.SETTINGS_KEYWORDS);
        },
        onError: () => {
          toast.error("수정에 실패했습니다.");
        },
      },
    );
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className="rounded-md border px-4 py-2"
    >
      저장
    </button>
  );
};

export default KeywordSaveButton;
