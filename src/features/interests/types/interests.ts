import { InterestDTO } from "../dtos/interestDto";

export type Interest = {
  id: string;
  name: string;
};

export type InterestCategory = {
  id: string;
  name: string;
  interests: InterestDTO[];
};
