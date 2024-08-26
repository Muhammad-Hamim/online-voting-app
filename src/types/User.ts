// src/types/User.ts

export type TUserData = {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  photo: string;
  role: "user" | "admin" | "superAdmin";
  status?: "pending" | "active" | "blocked";
  isDeleted: boolean;
  passwordChangedAt?: string;
  lastLogin?: string;
  createdAt: string; // Can also use Date
  updatedAt: string; // Can also use Date
  __v: number;
};
