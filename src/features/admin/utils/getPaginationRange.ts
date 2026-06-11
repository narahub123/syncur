type PaginationRangeItem = number | "...";

export function getPaginationRange(
  current: number,
  total: number,
  maxVisible = 10,
): PaginationRangeItem[] {
  // 페이지가 10개 이하이면 모두 표시
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const blockSize = 5;

  const start = Math.floor((current - 1) / blockSize) * blockSize + 1;
  const end = Math.min(start + blockSize - 1, total);

  const currentBlock = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i,
  );

  const tailStart = Math.max(total - blockSize + 1, 1);

  const tail = Array.from(
    { length: total - tailStart + 1 },
    (_, i) => tailStart + i,
  );

  // 현재 블록이 마지막 블록과 겹치거나 포함하는 경우
  if (end >= tailStart) {
    return currentBlock;
  }

  // 현재 블록과 마지막 블록이 연속되는 경우
  if (tailStart - end === 1) {
    return [...currentBlock, ...tail];
  }

  return [...currentBlock, "...", ...tail];
}
