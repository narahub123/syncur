import { ROUTES } from "@/shared/constants/routes";
import { SettingsMenuItemType } from "../types/settings";

export const SETTINGS_LIST: SettingsMenuItemType[] = [
  {
    category: "",
    label: "관심사",
    href: ROUTES.SETTINGS_INTERESTS,
  },
];
