import Button from "@/shared/components/ui/Button";
import { Interest } from "../types/interests";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

// 저장 후 창을 닫는다면 onClose도 전달받아야 함
type InterestSaveButtonProps = {
  disabled: boolean;
  selectedInterests: Interest[];
};

const InterestSaveButton = ({
  disabled,
  selectedInterests,
}: InterestSaveButtonProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleClick = async () => {
    /**
     * 중복 클릭 방지
     */
    if (isFetching) return;

    try {
      setIsFetching(true);

      // TODO: 관심사 저장 API 호출
    } catch (error) {
      console.error("[InterestSaveButton] 관심사 저장 실패", error);
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
            size={12}
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
