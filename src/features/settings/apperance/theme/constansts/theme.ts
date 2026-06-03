import { Monitor, Moon, Sun } from "lucide-react";

export const THEME_OPTIONS = [
  {
    value: "light",
    label: "라이트 모드",
    icon: Sun,
    desc: "항상 밝은 테마를 사용합니다",
  },
  {
    value: "dark",
    label: "다크 모드",
    icon: Moon,
    desc: "항상 어두운 테마를 사용합니다",
  },
  {
    value: "system",
    label: "시스템",
    icon: Monitor,
    desc: "OS 설정에 따라 자동으로 변경됩니다",
  },
] as const;
