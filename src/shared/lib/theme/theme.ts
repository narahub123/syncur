export type Theme = "light" | "dark" | "system";

/**
 * 실제 DOM 적용 시 사용되는 최종 해석된 테마 타입
 * system은 여기서 light 또는 dark로 변환됨
 */
type ResolvedTheme = "light" | "dark";

/**
 * localStorage 저장 키
 * 테마 값(light | dark | system)을 저장한다
 */
const STORAGE_KEY = "theme";

/**
 * localStorage에서 저장된 테마 값을 가져온다
 *
 * - SSR 환경에서는 window가 없으므로 null 반환
 * - 잘못된 값이 들어있는 경우 무시하고 null 반환
 */
export const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(STORAGE_KEY);

  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return null;
};

/**
 * 테마 값을 localStorage에 저장한다
 */
export const setStoredTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEY, theme);
};

/**
 * system 테마를 실제 적용 가능한 테마(light | dark)로 변환한다
 *
 * - light / dark → 그대로 사용
 * - system → OS 설정(prefers-color-scheme)에 따라 결정
 */
const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme !== "system") return theme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/**
 * 테마를 실제 DOM에 적용한다
 *
 * - resolvedTheme 기준으로 html에 dark class를 토글
 * - Tailwind dark mode는 이 class 기반으로 동작
 */
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  const resolved = resolveTheme(theme);

  root.classList.toggle("dark", resolved === "dark");
};
