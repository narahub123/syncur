import { Types } from "mongoose";

export interface CategoryLean {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}
