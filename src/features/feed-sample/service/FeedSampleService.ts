import { FeedSampleLean } from "../types/leans";
import { FeedItemInput } from "../types";
import { Types } from "mongoose";
import crypto from "crypto";
import { FeedSampleRepository } from "../repository/FeedSampleRepository";
import { toObjectId } from "@/shared/utils/toObjectId";

type FeedSampleCreateInput = Omit<
  FeedSampleLean,
  "_id" | "createdAt" | "updatedAt"
>;

export class FeedSampleService {
  constructor(private readonly repo: FeedSampleRepository) {}

  async createRssSamples(
    feedId: Types.ObjectId | string,
    items: FeedItemInput[],
  ) {
    const samples: FeedSampleCreateInput[] = items.map((item) =>
      this.toSample(feedId, item, "rss"),
    );

    return this.repo.createMany(samples);
  }

  async createCrawlerSamples(
    feedId: Types.ObjectId | string,
    items: FeedItemInput[],
  ) {
    const samples: FeedSampleCreateInput[] = items.map((item) =>
      this.toSample(feedId, item, "crawler"),
    );

    return this.repo.createMany(samples);
  }

  private toSample(
    feedId: Types.ObjectId | string,
    item: FeedItemInput,
    sourceType: "rss" | "crawler",
  ): FeedSampleCreateInput {
    return {
      feedId: toObjectId(feedId),

      sourceType,

      link: item.link,
      title: item.title,

      description: item.description ?? "",
      author: item.author,

      publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,

      categories: item.categories ?? [],

      status: "valid",

      error: undefined,

      hash: this.createHash(item.link, item.title),
    };
  }

  private createHash(link: string, title: string) {
    return crypto.createHash("sha1").update(`${link}::${title}`).digest("hex");
  }
}
