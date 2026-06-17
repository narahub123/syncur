"use server";

import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { requestService } from "../services/RequestService.instance";

export async function getRequestAction(requestId: string) {
  await connectMongo();
  await requireAdmin();

  return await requestService.getRequestByIdForAdmin(requestId);
}
