import { TUserData } from "./User";

type creator = Partial<TUserData> | string;

export type TPosition = {
  _id: string;
  title: string;
  description: string;
  duration: string;
  status: "pending" | "live" | "terminated" | "closed";
  terminationMessage?: string;
  maxVotes: number;
  creator: creator;
  maxCandidate: number;
  startTime: string;
  endTime?:string;
  appliedCandidates?: number;
  isDeleted: boolean;
};

export interface ErrorResponse {
  message: string;
}
export interface ICandidate {
  _id: string;
  candidate: string;
  name: string;
  email: string;
  message: string;
  studentId: string;
  photo: string;
  status: string;
  votes: number;
}

export interface IPosition {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "live" | "terminated" | "closed";
  creator: string;
  candidates: ICandidate[];
  winner?: ICandidate;
}
