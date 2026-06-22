import { Types } from "mongoose";

export type FeedFetchObservationLean = {
  _id: Types.ObjectId;

  executionId: string;
  feedId: Types.ObjectId;
  feedUrl: string;

  attempt: number;

  startTime: Date;
  endTime: Date;
  durationMs: number;

  success: boolean;

  errorCode?: string | null;
  errorMessage?: string | null;

  createdAt: Date;
  updatedAt: Date;
};
