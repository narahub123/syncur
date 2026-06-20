"use server";

import { requireAdmin } from "../../lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { AdminUsersQuery } from "../types/search";
import { adminUserService } from "../services/AdminUserService.instance";

/**
 * Admin - 사용자 목록 조회 Action
 *
 * 역할:
 * - 관리자 페이지에서 사용자 리스트 조회
 * - pagination / search 지원
 *
 * 처리 흐름:
 * 1. MongoDB 연결 보장
 * 2. 관리자 권한 검증
 * 3. service를 통한 데이터 조회
 */
export async function getAdminUsersPaginatedAction(query: AdminUsersQuery) {
  /**
   * MongoDB 연결 보장
   *
   * - Next.js server action은 요청마다 실행되므로
   *   DB 연결 상태를 항상 안전하게 보장해야 함
   */
  await connectMongo(); // ✔ entry point 책임

  /**
   * 관리자 권한 검증
   *
   * - 일반 사용자 접근 차단
   * - ADMIN role이 아닌 경우 실행 중단
   */
  await requireAdmin(); // ✔ auth guard (await 필수)

  /**
   * 사용자 목록 조회 (pagination + search)
   *
   * - service layer에서 pagination 처리
   * - DTO 변환 및 response 구조 생성
   */
  const users = await adminUserService.getUsersPaginated(query);

  return users;
}
