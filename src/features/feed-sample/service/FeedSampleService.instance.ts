import { feedSampleRepository } from "../repository/FeedSampleRepository.instance";
import { FeedSampleService } from "./FeedSampleService";

export const feedSampleService = new FeedSampleService(feedSampleRepository);
