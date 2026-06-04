import { Button } from "@/shared/components/ui/button";
import { Interest } from "../types/interests";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { saveUserInterestsAction } from "../actions/saveUserInterestsAction";
import { getCategoryIdsByInterestIds } from "../lib/getCategoriesByInterests";
import { toast } from "sonner";
import { SAVE_USER_INTERESTS_ERROR_MESSAGE } from "../constants/interest-selection-modal";

type InterestSaveButtonProps = {
  disabled: boolean;
  selectedInterests: Interest[];
  onClose?: () => void;
};

const InterestSaveButton = ({
  disabled,
  selectedInterests,
  onClose,
}: InterestSaveButtonProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleClick = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      const interestIds = selectedInterests.map((interest) => interest.id);

      const result = await saveUserInterestsAction({
        selectedCategoryIds: getCategoryIdsByInterestIds(interestIds),
        selectedInterestIds: interestIds,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("관심사가 저장되었습니다.");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("[InterestSaveButton] 관심사 저장 실패", error);
      toast.error(SAVE_USER_INTERESTS_ERROR_MESSAGE);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Button
      disabled={disabled || isFetching}
      type="button"
      onClick={handleClick}
      /**
       * 스크린 리더에 현재 버튼이 작업 중임을 알린다.
       */
      aria-busy={isFetching}
    >
      {isFetching ? (
        <>
          <LoaderCircle
            size={16}
            className="animate-spin"
            /**
             * 장식용 아이콘이므로 스크린 리더에서 제외한다.
             */
            aria-hidden="true"
          />
          {/**
           * 저장 중 상태를 스크린 리더에 안내한다.
           */}
          <span className="sr-only">관심사를 저장하는 중입니다.</span>
        </>
      ) : (
        "저장"
      )}
    </Button>
  );
};

export default InterestSaveButton;
