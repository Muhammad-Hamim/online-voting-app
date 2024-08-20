import { TCandidate } from "./candidates";
import { TPosition } from "./positions";
import { TUserData } from "./User";

export type TVoteCreate = {
  voter: string; //user id
  email: string;
  candidate: string; // candidate collection _id
  position: string; // position collection _id
};

export type TVotingRecord = {
  _id: string;
  voter: Partial<TUserData>;
  email: string;
  candidate: Partial<TCandidate>;
  position: Partial<TPosition>;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
