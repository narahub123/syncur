import { NativeButtonProps } from "@/shared/types/element-props";
import { cn } from "@/shared/utils/cn";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type SettingsBackButtonProps = NativeButtonProps;

/**
 * 설정 하위 페이지 뒤로가기 버튼.
 *
 * 브라우저 히스토리를 기준으로 이전 페이지로 이동한다.
 */
const SettingsBackButton = ({
  className,
  ...props
}: SettingsBackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      {...props}
      type="button"
      aria-label="뒤로가기"
      className={cn("flex-1 cursor-pointer p-3", className)}
      onClick={handleBack}
    >
      <ChevronLeft aria-hidden="true" />
    </button>
  );
};

export default SettingsBackButton;
