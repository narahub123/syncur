import { OAuthProviderType } from "next-auth/providers/oauth-types";

export type OAuthProvider = {
  provider: OAuthProviderType;
  name: string;
  icon: string;
};
