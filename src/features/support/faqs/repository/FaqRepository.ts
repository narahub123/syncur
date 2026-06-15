import { Types } from "mongoose";
import { FaqModel } from "../model/Faq";
import { FaqLean } from "../types/lean";
import { toObjectId } from "@/shared/utils/toObjectId";
import { CreateFaqDto, UpdateFaqDto } from "../dtos";

/**
 * Faq Repository
 * * MongoDB의 Faq(자주 묻는 질문) 컬렉션에 대한 직접적인 CRUD 연산을 담당하며,
 * 카테고리별 정렬 인덱싱 쿼리 및 원시 객체(Lean) 반환을 캡슐화합니다.
 */
export class FaqRepository {
  /**
   * FAQ 생성 (어드민 전용)
   * * @param dto 생성할 FAQ 데이터 규격 (카테고리, 질문, 답변, 정렬 순서 등)
   * @returns Mongoose 도큐먼트가 Plain Object로 변환된 FAQ Lean 객체
   */
  async create(dto: CreateFaqDto): Promise<FaqLean> {
    const faq = await FaqModel.create(dto);
    return faq.toObject();
  }

  /**
   * 카테고리별 FAQ 목록 조회 (sortOrder 오름차순, 최신순 정렬)
   * * @description 관리자가 지정한 노출 우선순위(sortOrder: 오름차순)를 기준으로 1차 정렬한 후,
   * 동일 순서 내에서는 최신 등록순(createdAt: 내림차순)으로 정렬하여 반환합니다.
   * * @param category 필터링할 특정 카테고리 명 (생략 시 전체 조회)
   * @returns 정렬 조건이 반영된 FAQ Lean 객체 배열
   */
  async findByCategory(category?: string): Promise<FaqLean[]> {
    const query = category ? { category } : {};
    return FaqModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  /**
   * 단일 FAQ 조회
   * * @param id 조회할 FAQ의 고유 ID (Types.ObjectId 또는 문자열)
   * @returns 검색된 FAQ Lean 객체 (존재하지 않을 경우 null)
   */
  async findById(id: Types.ObjectId | string): Promise<FaqLean | null> {
    return FaqModel.findById(toObjectId(id)).lean();
  }

  /**
   * FAQ 수정 (어드민 전용)
   * * @param id 수정할 FAQ의 고유 ID
   * @param dto 업데이트할 FAQ 데이터 필드 집합 ($set 원자적 반영)
   * @returns 수정이 완료된 이후의 FAQ Lean 객체 (존재하지 않을 경우 null)
   */
  async update(
    id: Types.ObjectId | string,
    dto: UpdateFaqDto,
  ): Promise<FaqLean | null> {
    return FaqModel.findByIdAndUpdate(
      toObjectId(id),
      { $set: dto },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * FAQ 삭제 (어드민 전용)
   * * @param id 삭제할 FAQ의 고유 ID
   * @returns 실제 도큐먼트가 삭제되었는지 여부 (true: 삭제 성공, false: 대상 없음)
   */
  async deleteById(id: Types.ObjectId | string): Promise<boolean> {
    const result = await FaqModel.deleteOne({ _id: toObjectId(id) });
    return result.deletedCount > 0;
  }
}
