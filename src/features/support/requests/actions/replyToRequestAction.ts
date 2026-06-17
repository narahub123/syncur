"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { requestService } from "../services/RequestService.instance";
import { RequestStatus } from "../constants/request-type";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

interface ReplyParams {
  requestId: string;
  replyContent: string;
  status: RequestStatus;
  images: ImageInfo[];
}

export async function replyToRequestAction({
  requestId,
  replyContent,
  status,
  images,
}: ReplyParams) {
  await connectMongo();
  const session = await requireAdmin();

  return await requestService.replyToRequest({
    requestId,
    replyContent,
    images,
    adminId: session.user.id,
    status,
  });
}
