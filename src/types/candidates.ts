import { TUserData } from "./User";

export type TCandidate = {
  _id: string;
  candidate: Partial<TUserData>;
  email: string;
  position: string;
  votes: number;
  status: "applied" | "approved" | "rejected";
  photo?: string;
  message?: string;
};
export type TCandidateApplication = {
  candidate: string;
  email: string;
  position: string;
  message: string;
};