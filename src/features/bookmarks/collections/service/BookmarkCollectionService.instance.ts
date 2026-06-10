import { BookmarkCollectionMapRepository } from "../../collection-map/repository/BookmarkCollectionMapRepository";
import { BookmarkCollectionRepository } from "../repository/BookmarkCollectionRepository";
import { BookmarkCollectionService } from "./BookmarkCollectionService";

export const bookmarkCollectionService = new BookmarkCollectionService(
  new BookmarkCollectionRepository(),
  new BookmarkCollectionMapRepository(),
);
