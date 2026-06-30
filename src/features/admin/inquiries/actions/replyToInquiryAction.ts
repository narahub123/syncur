"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { inquiryService } from "../services/InquiryService.instance";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { InquiryStatus } from "../types/search";

interface ReplyInquiryParams {
  inquiryId: string;
  userId: string;
  replyContent: string;
  status: InquiryStatus;
  images: ImageInfo[];
}

export async function replyToInquiryAction({
  inquiryId,
  userId,
  replyContent,
  status,
  images,
}: ReplyInquiryParams) {
  await connectMongo();
  const session = await requireAdmin();

  return await inquiryService.replyToInquiry({
    inquiryId,
    userId,
    replyContent,
    images,
    adminId: session.user.id,
    status,
  });
}
