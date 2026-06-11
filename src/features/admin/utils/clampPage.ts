export function clampPage(input: number, total: number) {
  if (input < 1) return 1;
  if (input > total) return total;
  return input;
}
