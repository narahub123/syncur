import { Schema, model, models, Document } from "mongoose";

export interface CategoryDocument extends Document {
  slug: string;
  name: string;
  userCount: number;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    userCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const CategoryModel =
  models.Category || model<CategoryDocument>("Category", CategorySchema);
