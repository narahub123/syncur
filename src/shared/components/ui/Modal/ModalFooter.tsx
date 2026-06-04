import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;

  /**
   * 버튼 정렬 방식
   *
   * end:
   * - 기본값
   * - 오른쪽 정렬 (OK / Cancel 같은 일반적인 모달 액션)
   *
   * center:
   * - 중앙 정렬
   * - 단일 액션 또는 안내성 모달에 사용
   *
   * between:
   * - 양쪽 분리 정렬
   * - 예: 왼쪽 "삭제", 오른쪽 "확인"
   */
  align?: "end" | "center" | "between";
};

const alignStyles = {
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
};

const ModalFooter = ({ className, children, align = "end" }: Props) => {
  return (
    <footer className={cn("mt-6 flex gap-2", alignStyles[align], className)}>
      {children}
    </footer>
  );
};

export default ModalFooter;
