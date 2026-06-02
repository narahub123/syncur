/**
 * OAuth 로그인 시작에 실패했을 때 표시하는 기본 메시지.
 *
 * 예:
 * - 네트워크 오류
 * - OAuth Provider 요청 실패
 * - signIn 호출 실패
 */
export const OAUTH_ERROR_MESSAGE =
  "로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.";

/**
 * NextAuth OAuth 에러 코드별 사용자 메시지.
 *
 * 사용 예:
 * /?error=Configuration
 * /?error=AccessDenied
 */
export const OAUTH_ERROR_MESSAGE_MAP: Record<string, string> = {
  /**
   * 인증 서버 설정에 문제가 있는 경우.
   *
   * 예:
   * - OAuth Client ID 설정 오류
   * - OAuth Client Secret 설정 오류
   * - Redirect URI 설정 오류
   */
  Configuration: "인증 설정에 문제가 있습니다.",

  /**
   * 사용자가 로그인을 취소했거나
   * OAuth 제공자가 접근을 거부한 경우.
   */
  AccessDenied: "로그인이 취소되었거나 접근이 거부되었습니다.",

  /**
   * 인증 정보가 만료되었거나
   * 이미 사용된 경우.
   */
  Verification: "인증 정보가 만료되었거나 이미 사용되었습니다.",

  /**
   * 정의되지 않은 인증 오류가 발생한 경우.
   */
  Default: "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

/**
 * 앱 내부 라우팅 및 접근 제어 에러 코드별 사용자 메시지.
 *
 * 사용 예:
 * /?appError=LoginRequired
 *
 * OAuth 인증 에러가 아닌
 * 애플리케이션 내부 정책에 의해 발생한 에러를 처리한다.
 */
export const APP_ERROR_MESSAGE_MAP: Record<string, string> = {
  /**
   * 로그인하지 않은 사용자가
   * 인증이 필요한 페이지에 접근한 경우.
   */
  LoginRequired: "로그인이 필요합니다.",

  /**
   * 정의되지 않은 앱 에러가 발생한 경우.
   */
  Default: "요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.",
};
