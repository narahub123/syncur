import Button from "@/shared/components/ui/Button";
import { Interest } from "../types/interests";
import { cn } from "@/shared/utils/cn";

type InterestButtonProps = {
  interest: Interest;
  onClick: () => void;
  isSelected: boolean;
  className?: string;
};

const InterestButton = ({
  interest,
  onClick,
  isSelected,
  className,
}: InterestButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      type="button"
      /**
       * 토글 버튼의 선택 상태를 스크린 리더에 전달한다.
       */
      aria-pressed={isSelected}
      className={cn(
        "text-sm focus-visible:outline-blue-600",
        isSelected
          ? "border-blue-500 bg-blue-50 text-blue-600"
          : "border-gray-200 bg-white text-gray-600",
        className,
      )}
    >
      {interest.name}
    </Button>
  );
};

export default InterestButton;
