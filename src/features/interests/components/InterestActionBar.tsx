import {
  INTEREST_MODAL_ERROR_MESSAGE,
  InterestModalErrorCode,
} from "../constants/interest-selection-modal";
import { InterestDTO } from "../dtos/interestDto";
import { CategoryWithInterests } from "../dtos/categoryDto"; // 1. 타입 추가
import InterestSaveButton from "./InterestSaveButton";

type InterestActionBarProps = {
  selectedCount: number;
  errorCode: InterestModalErrorCode | null;
  disabled: boolean;
  selectedInterests: InterestDTO[];
  categories: CategoryWithInterests[]; // 2. props 추가
  onClose?: () => void; // 3. onClose도 필요시 전달
};

const InterestActionBar = ({
  selectedCount,
  errorCode,
  disabled,
  selectedInterests,
  categories, // 추가
  onClose, // 추가
}: InterestActionBarProps) => {
  return (
    <section className="flex flex-col items-start gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm" aria-live="polite">
          <span>관심사 수: </span>
          <span className="text-green-500">{selectedCount}</span>
          <span>개</span>
        </p>

        {errorCode && (
          <p className="text-sm text-red-400" role="alert">
            {INTEREST_MODAL_ERROR_MESSAGE[errorCode]}
          </p>
        )}
      </div>

      <InterestSaveButton
        selectedInterests={selectedInterests}
        disabled={disabled}
        categories={categories} // 추가: 자식 버튼으로 전달
        onClose={onClose} // 추가
      />
    </section>
  );
};

export default InterestActionBar;
