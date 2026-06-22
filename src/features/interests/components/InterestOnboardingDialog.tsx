"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { InterestList } from "./InterestList";
import { useUpdateUserInterestsMutation } from "@/features/interests/hooks/useUpdateUserInterestsMutation";
import { InterestSelectionDTO } from "../dtos/userInterestDto";
import { IINTEREST_CONFIG } from "../constants/interest-config";
import { toast } from "sonner";

interface InterestOnboardingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InterestOnboardingDialog({
  open,
  onClose,
}: InterestOnboardingDialogProps) {
  const [selections, setSelections] = useState<InterestSelectionDTO[]>([]);
  const { mutate: saveInterests, isPending } = useUpdateUserInterestsMutation();

  // 선택된 총 개수를 계산하는 유틸리티 함수
  const getTotalSelectedCount = (selections: InterestSelectionDTO[]) =>
    selections.reduce((acc, curr) => acc + curr.interestIds.length, 0);

  const totalCount = getTotalSelectedCount(selections);

  const handleSave = () => {
    const hasSelections = selections.some((s) => s.interestIds.length > 0);
    if (!hasSelections) return;

    if (totalCount > IINTEREST_CONFIG.MAX_LIMIT) {
      toast.error("관심사는 최대 10개까지만 선택 가능합니다.");
      return;
    }

    saveInterests(
      { selections },
      {
        onSuccess: () => {
          toast.success("관심사가 성공적으로 저장되었습니다.");
          onClose();
        },
        onError: (error) => {
          // 에러 객체에서 메시지를 가져오거나 기본 메시지를 표시합니다.
          toast.error("저장에 실패했습니다. 다시 시도해주세요.");
          console.error("Save failed:", error); // 디버깅용
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[95vw] flex-col overflow-hidden p-0 sm:max-w-xl md:max-w-3xl">
        {/* 1. 헤더: 고정 */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl md:text-2xl">
            관심사를 선택해주세요
          </DialogTitle>
          <DialogDescription>
            관심사를 선택하신 후 맞춤형 콘텐츠를 받아보세요.
            <span className="font-semibold text-indigo-600">
              {`(최소 ${IINTEREST_CONFIG.MIN_LIMIT}개, 최대 ${IINTEREST_CONFIG.MAX_LIMIT}개)`}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* 2. 목록: 이 부분만 스크롤됨 */}
        <div className="flex-1 overflow-y-auto p-6 py-2">
          <InterestList onSelectionChange={setSelections} />
        </div>

        {/* 3. 푸터: !flex-col을 통해 row 레이아웃을 강제로 깨고 세로 정렬 수행 */}
        <DialogFooter className="mb-1 flex flex-none flex-col! border-t px-6 pt-2">
          <div className="mb-1 w-full space-x-2 pr-2 text-right text-sm text-gray-500">
            <span>현재 선택된 관심사:</span>
            <span className="font-bold text-blue-500">{totalCount}</span> /{" "}
            {IINTEREST_CONFIG.MAX_LIMIT}
          </div>
          <Button
            onClick={handleSave}
            disabled={
              isPending ||
              totalCount < IINTEREST_CONFIG.MIN_LIMIT ||
              totalCount > IINTEREST_CONFIG.MAX_LIMIT
            }
            className="w-full"
          >
            {isPending
              ? "저장 중..."
              : totalCount < IINTEREST_CONFIG.MIN_LIMIT
                ? `${IINTEREST_CONFIG.MIN_LIMIT - totalCount}개 더 선택해주세요`
                : "관심사 저장하고 시작하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
