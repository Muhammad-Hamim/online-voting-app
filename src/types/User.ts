// src/types/User.ts

export type TUserData = {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  photo: string;
  role: string;
  isDeleted: boolean;
  passwordChangedAt?:string;
  createdAt: string; // Can also use Date
  updatedAt: string; // Can also use Date
  status: string;
  __v: number;
};
