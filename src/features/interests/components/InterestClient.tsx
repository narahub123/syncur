"use client";

import { useState } from "react";
import { InterestList } from "./InterestList";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { InterestSelectionDTO } from "../dtos/userInterestDto";
import { IINTEREST_CONFIG } from "../constants/interest-config";
import { updateUserInterestsAction } from "@/features/interests/actions/updateUserInterestsAction";

export default function InterestClient() {
  const [selections, setSelections] = useState<InterestSelectionDTO[]>([]);
  const [isPending, setIsPending] = useState(false);

  // 선택된 총 개수 계산
  const totalCount = selections.reduce(
    (acc, curr) => acc + curr.interestIds.length,
    0,
  );

  const handleSave = async () => {
    if (totalCount < IINTEREST_CONFIG.MIN_LIMIT) {
      toast.error(`${IINTEREST_CONFIG.MIN_LIMIT}개 이상 선택해주세요.`);
      return;
    }

    setIsPending(true);
    // 서버 액션 호출
    const result = await updateUserInterestsAction({ selections });
    setIsPending(false);

    if (result.success) {
      toast.success("관심사가 저장되었습니다.");
    } else {
      toast.error(result.error || "저장에 실패했습니다.");
    }
  };

  return (
    <div className="mx-auto w-full p-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">관심사 설정</h1>
        <p className="text-muted-foreground">
          관심사를 선택하신 후 맞춤형 콘텐츠를 받아보세요.
        </p>
      </div>

      {/* 이미 잘 구현된 InterestList를 그대로 사용 */}
      <InterestList onSelectionChange={setSelections} />

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <div className="text-sm text-gray-500">
          <span>현재 선택된 관심사: </span>
          <span className="font-bold text-blue-500">{totalCount}</span> /{" "}
          {IINTEREST_CONFIG.MAX_LIMIT}
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending || totalCount < IINTEREST_CONFIG.MIN_LIMIT}
        >
          {isPending ? "저장 중..." : "변경 사항 저장"}
        </Button>
      </div>
    </div>
  );
}
