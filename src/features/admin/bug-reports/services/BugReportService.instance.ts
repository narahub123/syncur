import { bugReportRepository } from "../repositories/BugReportRepository.instance";
import { BugReportService } from "./BugReportService";

export const bugReportService = new BugReportService(bugReportRepository);
