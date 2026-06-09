import { cn } from "@/shared/utils/cn";

type Props = {
  ref: React.RefObject<HTMLDivElement | null>; // IntersectionObserver가 감지할 대상 DOM ref
  className?: string; // 추가 스타일링을 위한 className
};

/**
 * 무한 스크롤 트리거용 sentinel 컴포넌트
 *
 * - 화면 하단에 위치하며 IntersectionObserver의 감지 대상 역할
 * - 이 요소가 화면에 들어오면 다음 페이지 요청(fetchNextPage)을 트리거함
 */
const LoadMoreTrigger = ({ ref, className }: Props) => {
  return (
    // observer가 붙는 실제 DOM 요소
    <div ref={ref} className={cn("", className)} />
  );
};

export default LoadMoreTrigger;
