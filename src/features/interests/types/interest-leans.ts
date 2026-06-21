import { Types } from "mongoose";

export interface InterestLean {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  categoryId: Types.ObjectId;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}
