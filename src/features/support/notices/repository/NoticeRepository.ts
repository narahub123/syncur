import { Types } from "mongoose";
import { NoticeModel } from "../model/Notice";
import { NoticeLean } from "../types/lean";
import { toObjectId } from "@/shared/utils/toObjectId";
import { UserNoticeQuery } from "../types/search";

/**
 * Notice Repository
 * * MongoDB의 Notice(공지사항) 컬렉션에 대한 직접적인 CRUD 연산을 담당하며,
 * 원시 객체(Lean) 형태로 데이터를 격리하여 반환합니다.
 */
export class NoticeRepository {
  /**
   * 단일 공지사항 조회
   * * @param id 조회할 공지사항의 고유 ID (Types.ObjectId 또는 문자열)
   * @returns 검색된 공지사항 Lean 객체 (존재하지 않을 경우 null)
   */
  async findById(id: Types.ObjectId | string): Promise<NoticeLean | null> {
    return NoticeModel.findById(toObjectId(id)).lean();
  }

  /**
   * 공지사항 상세 조회 시 조회수(views) 원자적 증가
   * * @description 동시성 환경에서 데이터 부정합을 막기 위해
   * MongoDB의 $inc 연산자를 활용하여 원자적(Atomic)으로 갱신합니다.
   * * @param id 조회수를 증가시킬 공지사항의 고유 ID
   * @returns 갱신이 완료된 이후의 공지사항 Lean 객체 (존재하지 않을 경우 null)
   */
  async incrementViews(
    id: Types.ObjectId | string,
  ): Promise<NoticeLean | null> {
    return NoticeModel.findByIdAndUpdate(
      toObjectId(id),
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 공지사항 목록 조회 (상단 고정글 우선 정렬)
   * * @description 중요 공지(isPinned: true)를 최상단에 먼저 배치(내림차순)한 후,
   * 일반 공지사항들을 최신 등록순(createdAt: 내림차순)으로 정렬하여 반환합니다.
   * * @param limit 가져올 최대 도큐먼트 개수 (기본값: 10)
   * @returns 정렬 기준이 적용된 공지사항 Lean 객체 배열
   */
  async findAll(limit = 10): Promise<NoticeLean[]> {
    return NoticeModel.find()
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * 유저용 공지사항 목록 조회 (페이지네이션 + 검색 + 고정글 우선 정렬)
   */
  async findAndCountForUser(
    params: UserNoticeQuery,
  ): Promise<{ items: NoticeLean[]; totalCount: number }> {
    const {
      page,
      limit,
      search,
      searchField = "title",
      sort = "createdAt",
      sortOrder = "desc",
    } = params;
    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    // 💡 고정글 우선 규칙과 동적 정렬 모두 1 | -1 구조로 정밀 매핑
    const sortCondition: Record<string, 1 | -1> = {
      isPinned: -1,
      [sort]: mongoOrder,
    };

    const query: Record<string, unknown> = {};
    if (search && search.trim().length > 0) {
      query[searchField] = { $regex: search, $options: "i" };
    }

    const [items, totalCount] = await Promise.all([
      NoticeModel.find(query)
        .sort(sortCondition) // 💡 any 없이 통과
        .skip(skip)
        .limit(limit)
        .lean(),
      NoticeModel.countDocuments(query),
    ]);

    return { items, totalCount };
  }
}
