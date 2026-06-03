import {
  INTEREST_MODAL_ERROR_MESSAGE,
  InterestModalErrorCode,
} from "../constants/interest-selection-modal";
import { Interest } from "../types/interests";
import InterestSaveButton from "./InterestSaveButton";

type InterestActionBarProps = {
  selectedCount: number;
  errorCode: InterestModalErrorCode | null;
  disabled: boolean;
  selectedInterests: Interest[];
};

const InterestActionBar = ({
  selectedCount,
  errorCode,
  disabled,
  selectedInterests,
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
      />
    </section>
  );
};

export default InterestActionBar;
