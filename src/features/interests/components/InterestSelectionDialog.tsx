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

import {
  INTEREST_MODAL_ERROR_MESSAGE,
  INTEREST_MODAL_TEXT,
  InterestModalErrorCode,
  MAX_INTEREST_COUNT,
  MIN_INTEREST_COUNT,
} from "../constants/interest-selection-modal";

import InterestSelector from "./InterestSelector";
import InterestSaveButton from "./InterestSaveButton";
import { InterestDTO } from "../dtos/interestDto";
import { useCategoriesWithInterestsQuery } from "@/features/admin/interests/hooks/useCategoriesWithInterestsQuery";

type InterestSelectionDialogProps = {
  open: boolean;
  onClose: () => void;
};

const InterestSelectionDialog = ({
  open,
  onClose,
}: InterestSelectionDialogProps) => {
  // 1. 카테고리 데이터 페칭
  const { data: categoriesData, isLoading } = useCategoriesWithInterestsQuery();

  const [selectedInterests, setSelectedInterests] = useState<InterestDTO[]>([]);
  const [errorCode, setErrorCode] = useState<InterestModalErrorCode | null>(
    null,
  );

  const handleToggleInterest = (interest: InterestDTO) => {
    const isSelected = selectedInterests.some(
      (item) => item._id === interest._id,
    );

    if (selectedInterests.length >= MAX_INTEREST_COUNT && !isSelected) {
      setErrorCode("EXCEED");
      return;
    }

    const nextSelectedInterests = isSelected
      ? selectedInterests.filter((item) => item._id !== interest._id)
      : [...selectedInterests, interest];

    setSelectedInterests(nextSelectedInterests);

    if (nextSelectedInterests.length < MIN_INTEREST_COUNT) {
      setErrorCode("INSUFFICIENT");
      return;
    }

    setErrorCode(null);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>{INTEREST_MODAL_TEXT.TITLE}</DialogTitle>

          <DialogDescription>
            {INTEREST_MODAL_TEXT.DESCRIPTION}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* 2. 페칭된 데이터를 InterestSelector로 전달 */}
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-gray-500">
              로딩 중...
            </div>
          ) : (
            <InterestSelector
              categories={categoriesData || []}
              selectedInterests={selectedInterests}
              onSelect={handleToggleInterest}
            />
          )}
        </div>

        <DialogFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm" aria-live="polite">
              <span>관심사 수: </span>
              <span className="text-green-500">{selectedInterests.length}</span>
              <span>개</span>
            </p>

            {errorCode && (
              <p className="text-sm text-red-400" role="alert">
                {INTEREST_MODAL_ERROR_MESSAGE[errorCode]}
              </p>
            )}
          </div>

          <InterestSaveButton
            disabled={selectedInterests.length < MIN_INTEREST_COUNT}
            selectedInterests={selectedInterests}
            onClose={onClose}
            categories={categoriesData || []}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterestSelectionDialog;
