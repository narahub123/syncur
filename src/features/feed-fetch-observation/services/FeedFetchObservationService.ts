import {
  FeedFetchObservationCreateDTO,
  FeedFetchObservationDTO,
} from "../dtos/feedFetchObservationDTO";
import {
  toFeedFetchObservationDTO,
  toFeedFetchObservationDTOs,
} from "../mappers/toFeedFetchObservationDTO";
import { FeedFetchObservationRepository } from "../repositories/FeedFetchObservationRepository";

/**
 * FeedFetchObservation Service
 *
 * === 역할 ===
 * - observer 입력 받음
 * - DB 저장 정책 관리
 * - repository 호출
 */
export class FeedFetchObservationService {
  constructor(private readonly repo = new FeedFetchObservationRepository()) {}

  async record(
    log: FeedFetchObservationCreateDTO,
  ): Promise<FeedFetchObservationDTO> {
    console.log("log", log);
    /**
     * 여기서 추가 정책 가능
     * - sampling
     * - filtering
     * - rate limit
     */
    const doc = await this.repo.create(log);
    return toFeedFetchObservationDTO(doc);
  }

  async recordBatch(
    logs: FeedFetchObservationCreateDTO[],
  ): Promise<FeedFetchObservationDTO[]> {
    const docs = await this.repo.createMany(logs);
    return toFeedFetchObservationDTOs(docs);
  }

  async findByExecutionId(executionId: string) {
    const docs = await this.repo.findByExecutionId(executionId);

    return toFeedFetchObservationDTOs(docs);
  }
}
