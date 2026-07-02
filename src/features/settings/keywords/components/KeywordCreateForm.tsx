import { useState } from "react";
import { useCreateKeywordMutation } from "@/features/keywords/hooks/useCreateKeywordMutation";
import { SubscriptionItemDto } from "@/features/subscriptions/dto/subscriptionDto";
import { PaginatedResponse } from "@/shared/types/pagination";
import { MultiSelect } from "./MultiSelect";
import { toast } from "sonner";

type Props = {
  data: PaginatedResponse<SubscriptionItemDto>;
};

const KeywordCreateForm = ({ data }: Props) => {
  const [keyword, setKeyword] = useState("");
  const [targets, setTargets] = useState<string[]>(["ALL"]);

  const { items: subscriptions } = data;
  const mutation = useCreateKeywordMutation();

  const options = [
    { label: "전체", value: "ALL" },
    ...subscriptions.map((s) => ({
      label: s.siteName,
      value: s.subscriptionId,
    })),
  ];

  const handleChange = (value: string[]) => {
    if (value.includes("ALL")) {
      setTargets(["ALL"]);
      return;
    }

    setTargets(value);
  };

  const handleClick = () => {
    if (!keyword.trim()) return;

    const isAll = targets.includes("ALL");

    mutation.mutate(
      {
        displayKeyword: keyword,
        keyword: keyword.trim().toLowerCase(),
        subscriptionIds: isAll ? [] : targets,
      },
      {
        onSuccess: () => {
          toast.success("키워드가 등록되었습니다");

          setKeyword("");
          setTargets(["ALL"]);
        },
        onError: () => {
          toast.error("키워드 등록에 실패했습니다");
        },
      },
    );
  };

  return (
    <div className="mt-6 flex items-center gap-2">
      <input
        className="flex-1 rounded-md border px-2 py-1 text-sm"
        placeholder="키워드를 입력하세요."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <MultiSelect options={options} value={targets} onChange={handleChange} />

      <button
        className="cursor-pointer rounded-md border px-3 py-1 text-sm"
        onClick={handleClick}
      >
        추가
      </button>
    </div>
  );
};

export default KeywordCreateForm;
