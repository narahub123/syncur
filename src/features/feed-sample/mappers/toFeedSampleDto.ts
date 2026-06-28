import { FeedSampleDto } from "../dto/feedSampleDto";
import { FeedSampleLean } from "../types/leans";

/**
 * FeedSampleLean → FeedSampleDto 변환
 *
 * - ObjectId → string
 * - Date → ISO string
 * - API / Frontend 전달용 표준화
 */
export function toFeedSampleDto(sample: FeedSampleLean): FeedSampleDto {
  return {
    _id: sample._id.toString(),
    feedId: sample.feedId.toString(),

    sourceType: sample.sourceType,

    link: sample.link,
    title: sample.title,

    description: sample.description,
    author: sample.author,

    publishedAt: sample.publishedAt
      ? sample.publishedAt.toISOString()
      : undefined,

    categories: sample.categories,

    status: sample.status,

    error: sample.error,

    hash: sample.hash,

    createdAt: sample.createdAt.toISOString(),
    updatedAt: sample.updatedAt.toISOString(),
  };
}

export function toFeedSampleDtos(samples: FeedSampleLean[]): FeedSampleDto[] {
  return samples.map(toFeedSampleDto);
}
