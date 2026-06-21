import { DatabaseError } from "./DatabaseError";

// 타입 가드 함수: 에러가 DatabaseError 형태인지 검사
export const isDatabaseError = (error: unknown): error is DatabaseError => {
  return typeof error === "object" && error !== null && "code" in error;
};
