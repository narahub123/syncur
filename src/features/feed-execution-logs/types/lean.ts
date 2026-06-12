import { Types } from "mongoose";
import { FeedExecutionError, FetchLog, ParseLog, PersistLog } from ".";
import {
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";

export type FeedExecutionLogLean = {
  _id: Types.ObjectId;

  feedId: Types.ObjectId;
  executionId: string;

  status: FeedExecutionStatus;
  reason: FeedExecutionReason;

  startedAt: Date;
  finishedAt?: Date | null;
  durationMs?: number | null;

  httpStatus?: number | null;
  cacheHit?: boolean;

  fetch?: FetchLog | null;
  parse?: ParseLog | null;
  persist?: PersistLog | null;

  fetchedCount?: number;
  insertedCount?: number;

  error?: FeedExecutionError | null;
  failedAtStage?: FeedExecutionStage | null;

  createdAt: Date;
  updatedAt: Date;
};

export type FeedExecutionLogWithFeedAndSiteLean = {
  _id: Types.ObjectId;

  executionId: string;
  status: string;
  reason: string;

  startedAt: Date;
  finishedAt?: Date | null;
  durationMs?: number | null;

  httpStatus?: number | null;
  cacheHit?: boolean;

  fetchedCount?: number;
  insertedCount?: number;

  error?: FeedExecutionError;
  failedAtStage?: FeedExecutionStage | null;

  createdAt: Date;
  updatedAt: Date;

  /**
   * JOIN 결과
   */
  feed?: {
    _id: Types.ObjectId;
    feedUrl: string;
    status: string;
    siteId: Types.ObjectId;
  } | null;

  site?: {
    _id: Types.ObjectId;
    url: string;
    name: string;
    favicon_url: string | null;
  } | null;
};
