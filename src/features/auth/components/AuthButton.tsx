"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import Button from "@/shared/components/ui/Button";
import { ROUTES } from "@/shared/constants/routes";
import { OAuthProvider } from "../types/oauth";
import { toast } from "sonner";
import { OAUTH_ERROR_MESSAGE } from "../constants/message";

type AuthButtonProps = {
  oauth: OAuthProvider;
};

const AuthButton = ({ oauth }: AuthButtonProps) => {
  const { provider, name, icon } = oauth;

  /**
   * 선택한 OAuth 제공자로 로그인을 시작한다.
   *
   * 로그인 성공 시 피드 페이지로 이동한다.
   */
  const handleClick = async () => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.FEED,
      });
    } catch (error) {
      toast.error(OAUTH_ERROR_MESSAGE);
      console.error("소셜 로그인 실패", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      className="flex min-w-52 items-center justify-center gap-2"
      aria-label={`${name}로 계속하기`}
      title={`${name}로 계속하기`}
    >
      <Image
        src={icon}
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
        className="h-5 w-5"
      />
      <span>{name}로 계속하기</span>
    </Button>
  );
};

export default AuthButton;
