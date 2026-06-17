import { ROUTES } from "@/shared/constants/routes";
import { SettingsMenuItemType } from "../types/settings";

export const SETTINGS_LIST: SettingsMenuItemType[] = [
  {
    category: "account",
    label: "계정 관리",
    href: ROUTES.SETTINGS_ACCOUNT,
  },
  {
    category: "subscriptions",
    label: "구독 관리",
    href: ROUTES.SETTINGS_SUBSCRIPTIONS,
  },
  {
    category: "interests",
    label: "관심사",
    href: ROUTES.SETTINGS_INTERESTS,
  },
  {
    category: "appearance",
    label: "화면 설정",
    href: ROUTES.SETTINGS_APPEARANCE,
  },
  {
    category: "extra",
    label: "기타 설정",
    href: ROUTES.SETTINGS_EXTRA,
  },
];
