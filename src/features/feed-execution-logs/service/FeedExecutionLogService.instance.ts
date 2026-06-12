import { FeedExecutionLogRepository } from "../repository/FeedExecutionLogRepository";
import { FeedExecutionLogService } from "./FeedExecutionLogService";

export const feedExecutionLogService = new FeedExecutionLogService(
  new FeedExecutionLogRepository(),
);
