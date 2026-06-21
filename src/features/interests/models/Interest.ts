import { Schema, model, models, Document, Types } from "mongoose";

export interface InterestDocument extends Document {
  slug: string;
  name: string;
  categoryId: Types.ObjectId;
  userCount: number;
}

const InterestSchema = new Schema<InterestDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const InterestModel =
  models.Interest || model<InterestDocument>("Interest", InterestSchema);
