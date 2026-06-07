import { UserFeedInteractionRepository } from "../repositories/UserFeedInteractionRepository";
import { UserFeedInteractionService } from "./UserFeedInteractionService";

export const userFeedInteractionService = new UserFeedInteractionService(
  new UserFeedInteractionRepository(),
);
