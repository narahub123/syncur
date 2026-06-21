import { Schema, model, models, Document, Types } from "mongoose";

export interface UserInterestProfileDocument extends Document {
  userId: Types.ObjectId;
  categoryIds: Types.ObjectId[];
  interestIds: Types.ObjectId[];
}

const UserInterestProfileSchema = new Schema<UserInterestProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    interestIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Interest",
      },
    ],
  },
  {
    collection: "user_interest_profiles",
    timestamps: true,
    versionKey: false,
  },
);

export const UserInterestProfileModel =
  models.UserInterestProfile ||
  model<UserInterestProfileDocument>(
    "UserInterestProfile",
    UserInterestProfileSchema,
  );
