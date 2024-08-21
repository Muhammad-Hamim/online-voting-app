import React, { createContext } from "react";
import axiosInstance from "@/api/axiosInstance";

// Define the type for the context
interface AuthContextType {
  logout: () => Promise<boolean | undefined>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const logout = async (): Promise<boolean | undefined> => {
    try {
      localStorage.removeItem("token");
      const response = await axiosInstance.post("/auth/logout", {});
      return response?.data?.success;
    } catch (error) {
      console.log("Logout request failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
