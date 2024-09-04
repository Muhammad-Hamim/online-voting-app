import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import { useUserInfo } from "@/hooks/useUserInfo";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useUserInfo();
  const { pathname } = useLocation();

  if (isLoading) {
    return (
      <div className="absolute bg-transparent w-fit h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CirclesWithBar
          height="80"
          width="80"
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (!user || user.role === "user") {
    return <Navigate to={"/"} state={pathname} />;
  }
  if (user.role === "superAdmin" || user.role === "admin") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
