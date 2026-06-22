import { FeedFetchObservationCreateDTO } from "../dtos/feedFetchObservationDTO";
import { FeedFetchObservationModel } from "../models/FeedFetchObservation";
import { FeedFetchObservationLean } from "../types/leans";

/**
 * FeedFetchObservation Repository
 *
 * === 역할 ===
 * - DB 접근 전담
 * - 순수 CRUD
 */
export class FeedFetchObservationRepository {
  async create(
    data: FeedFetchObservationCreateDTO,
  ): Promise<FeedFetchObservationLean> {
    const doc = await FeedFetchObservationModel.create({
      executionId: data.executionId,
      feedId: data.feedId,
      feedUrl: data.feedUrl,
      attempt: data.attempt,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      durationMs: data.durationMs,
      success: data.success,
      errorCode: data.errorCode,
      errorMessage: data.errorMessage,
    });

    return doc.toObject();
  }

  async createMany(
    data: FeedFetchObservationCreateDTO[],
  ): Promise<FeedFetchObservationLean[]> {
    const docs = await FeedFetchObservationModel.insertMany(
      data.map((d) => ({
        ...d,
        startTime: new Date(d.startTime),
        endTime: new Date(d.endTime),
      })),
    );

    return docs.map((doc) => doc.toObject() as FeedFetchObservationLean);
  }

  async findByExecutionId(
    executionId: string,
  ): Promise<FeedFetchObservationLean[]> {
    const docs = await FeedFetchObservationModel.find({
      executionId,
    })
      .sort({ attempt: 1 }) // retry 순서 보장
      .lean();

    return docs;
  }
}
