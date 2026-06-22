import { Schema, model, models, Document, Types } from "mongoose";
import { InterestSelectionLean } from "../types/user-interest-leans";

export interface UserInterestDocument extends Document {
  userId: Types.ObjectId;
  selections: InterestSelectionLean[];
}

const UserInterestSchema = new Schema<UserInterestDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    selections: [
      {
        categoryId: {
          type: Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        interestIds: [
          {
            type: Schema.Types.ObjectId,
            ref: "Interest",
          },
        ],
      },
    ],
  },
  {
    collection: "user_interests", // 컬렉션 명도 복수형으로 맞추면 더 깔끔합니다.
    timestamps: true,
    versionKey: false,
  },
);

export const UserInterestModel =
  models.UserInterest ||
  model<UserInterestDocument>("UserInterest", UserInterestSchema);
