import { TCandidate } from "./candidates";
import { TUserData } from "./User";

interface candidates extends Partial<TCandidate> {
  voters: Partial<TUserData>[];
  name:string;
  email:string;
  studentId:string;
}

export type TPosition = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "live" | "terminated" | "closed";
  terminationMessage?: string;
  maxVotes: number;
  creator: Partial<TUserData>;
  maxCandidates: number;
  startTime: string;
  endTime: string;
  appliedCandidates?: number;
  isDeleted: boolean;
  candidates: candidates[];
  createdAt:string;
  updatedAt: string; 
};

export interface ErrorResponse {
  message: string;
}
export interface ICandidate {
  _id?: string;
  candidate?: string;
  name: string;
  email: string;
  message: string;
  position:string;
  studentId: string;
  photo: string;
  status: string;
  votes: number;
  voters?:Partial<TUserData>[];
}

export interface IPosition {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "live" | "terminated" | "closed";
  creator: string;
  startTime:string;
  endTime: string;
  candidates: ICandidate[];
  winner?: ICandidate;
}
