import { FeedSampleModel } from "../model/FeedSample";
import { FeedSampleLean } from "../types/leans";

type FeedSampleCreateInput = Omit<
  FeedSampleLean,
  "_id" | "createdAt" | "updatedAt"
>;

export class FeedSampleRepository {
  /**
   * bulk insert
   */
  async createMany(items: FeedSampleCreateInput[]): Promise<FeedSampleLean[]> {
    return FeedSampleModel.insertMany(items);
  }

  /**
   * feedId 기준 조회
   */
  async findByFeedId(feedId: string) {
    return FeedSampleModel.find({ feedId }).lean<FeedSampleLean[]>();
  }

  /**
   * sample 삭제
   */
  async deleteByFeedId(feedId: string) {
    return FeedSampleModel.deleteMany({ feedId });
  }

  /**
   * 상태 업데이트
   */
  async updateStatus(
    sampleId: string,
    status: "valid" | "invalid",
    error?: string,
  ) {
    return FeedSampleModel.updateOne({ _id: sampleId }, { status, error });
  }
}
