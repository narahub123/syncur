"use client";

import { Modal } from "@/shared/components/ui/Modal";
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

type InterestSelectionModalProps = { open: boolean; onClose: () => void };

const InterestSelectionModal = ({
  open,
  onClose,
}: InterestSelectionModalProps) => {
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
    <Modal.Root open={open} onClose={onClose}>
      <Modal.Content className="flex max-h-[90vh] flex-col">
        <Modal.Header>
          <Modal.Title>{INTEREST_MODAL_TEXT.TITLE}</Modal.Title>
          <Modal.Description>
            {INTEREST_MODAL_TEXT.DESCRIPTION}
          </Modal.Description>
        </Modal.Header>
        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <InterestSelector
            categories={INTEREST_CATEGORIES}
            selectedInterests={selectedInterests}
            onSelect={handleToggleInterest}
          />
        </div>
        <Modal.Footer className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default InterestSelectionModal;
