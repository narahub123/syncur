import { feedFetchObservationRepository } from "../repositories/FeedFetchObservationRepository.instance";
import { FeedFetchObservationService } from "./FeedFetchObservationService";

export const feedFetchObservationService = new FeedFetchObservationService(
  feedFetchObservationRepository,
);
