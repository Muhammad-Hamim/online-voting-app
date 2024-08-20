import React, {
  createContext,
} from "react";
import axiosInstance from "@/api/axiosInstance";

// Define the type for the context
interface AuthContextType {
  logout: () => Promise<boolean>;
  
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {


  const logout = async (): Promise<boolean> => {
    try {
      localStorage.removeItem("token");
      await axiosInstance.post("/auth/logout",{});
      return true;
    } catch (error) {
      console.log("Logout request failed", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
