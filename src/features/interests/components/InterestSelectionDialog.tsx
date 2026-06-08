"use client";

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
import { INTEREST_CATEGORIES } from "../constants/interests";
import { useState } from "react";
import { Interest } from "../types/interests";
import InterestSaveButton from "./InterestSaveButton";

type InterestSelectionDialogProps = {
  open: boolean;
  onClose: () => void;
};

const InterestSelectionDialog = ({
  open,
  onClose,
}: InterestSelectionDialogProps) => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [errorCode, setErrorCode] = useState<InterestModalErrorCode | null>(
    null,
  );

  const handleToggleInterest = (interest: Interest) => {
    const isSelected = selectedInterests.some(
      (item) => item.id === interest.id,
    );

    if (selectedInterests.length >= MAX_INTEREST_COUNT && !isSelected) {
      setErrorCode("EXCEED");
      return;
    }

    const nextSelectedInterests = isSelected
      ? selectedInterests.filter((item) => item.id !== interest.id)
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
          <InterestSelector
            categories={INTEREST_CATEGORIES}
            selectedInterests={selectedInterests}
            onSelect={handleToggleInterest}
          />
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
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterestSelectionDialog;
