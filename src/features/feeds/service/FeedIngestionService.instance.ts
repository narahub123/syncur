import { FeedRepository } from "../repository/FeedRepository";
import { FeedIngestionService } from "./FeedIngestionService";

export const feedIngestionService = new FeedIngestionService(
  new FeedRepository(),
);
