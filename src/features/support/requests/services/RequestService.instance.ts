import { requestRepository } from "../repository/RequestRepository.instance";
import { RequestService } from "./RequestService";

export const requestService = new RequestService(requestRepository);
