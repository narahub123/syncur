import { adminDashboardRepository } from "../repository/AdminDashboardRepository.instance";
import { AdminDashboardService } from "./AdminDashboardService";

export const adminDashboardService = new AdminDashboardService(
  adminDashboardRepository,
);
