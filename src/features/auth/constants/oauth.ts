import { OAUTH_ICONS } from "@/shared/constants/oauthIcons";
import { OAuthProvider } from "../types/oauth";

export const OAUTH_LIST: OAuthProvider[] = [
  {
    provider: "google",
    name: "구글",
    icon: OAUTH_ICONS.GOOGLE,
  },
  {
    provider: "kakao",
    name: "카카오",
    icon: OAUTH_ICONS.KAKAO,
  },
  {
    provider: "github",
    name: "깃허브",
    icon: OAUTH_ICONS.GITHUB,
  },
  {
    provider: "discord",
    name: "디스코드",
    icon: OAUTH_ICONS.DISCORD,
  },
];
