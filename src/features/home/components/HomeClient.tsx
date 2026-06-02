"use client";

import AuthButton from "@/features/auth/components/AuthButton";
import { OAUTH_LIST } from "@/features/auth/constants/oauth";
import AuthErrorToast from "@/features/auth/components/AuthErrorToast";

const HomeClient = () => {
  AuthErrorToast();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p>홈페이지</p>
      <div className="space-y-4">
        {OAUTH_LIST.map((oauth) => (
          <AuthButton oauth={oauth} key={oauth.provider} />
        ))}
      </div>
    </div>
  );
};

export default HomeClient;
