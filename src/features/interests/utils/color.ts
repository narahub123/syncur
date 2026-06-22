const CATEGORY_THEMES = [
  {
    light: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dark: "bg-indigo-600 text-white border-indigo-600",
  },
  {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "bg-emerald-600 text-white border-emerald-600",
  },
  {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "bg-amber-600 text-white border-amber-600",
  },
  {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "bg-rose-600 text-white border-rose-600",
  },
  {
    light: "bg-sky-50 text-sky-700 border-sky-200",
    dark: "bg-sky-600 text-white border-sky-600",
  },
];

// 메모리에 카테고리별 인덱스를 저장할 Map
const categoryColorMap = new Map<string, number>();

export const getCategoryTheme = (categoryId: string) => {
  // 1. 이미 할당된 색상이 있는지 확인
  if (!categoryColorMap.has(categoryId)) {
    // 2. 없으면 현재 Map의 크기를 인덱스로 사용하여 새로 할당
    const nextIndex = categoryColorMap.size % CATEGORY_THEMES.length;
    categoryColorMap.set(categoryId, nextIndex);
  }

  // 3. 할당된 인덱스로 테마 반환
  const index = categoryColorMap.get(categoryId)!;
  return CATEGORY_THEMES[index];
};
