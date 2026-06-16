import { Schema } from "mongoose";

export interface ImageInfo {
  url: string;
  publicId: string;
}

export const ImageInfoSchema = new Schema<ImageInfo>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: false,
  },
);
