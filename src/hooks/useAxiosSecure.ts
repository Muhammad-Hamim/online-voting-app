import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import toast from "react-hot-toast";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BaseURL,
  withCredentials: true, // Ensure that cookies are included in requests
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 500) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const response = await axiosSecure.post("/auth/refresh-token", {});
            
            // Check if refresh token response is valid
            if (response && response?.data && response?.data?.data?.accessToken) {
              const newAccessToken = response?.data?.data?.accessToken;
              localStorage.setItem("token", newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              
              // Retry the original request with the new token
              return axiosSecure(originalRequest);
            } else {
              // If the refresh token is invalid or expired, show a toast and logout the user
              toast.error("Session expired. Please log in again.");
              await logout();
              navigate("/");
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // Handle cases where the refresh token request fails
            console.error("Token refresh failed:", refreshError);
            toast.error("Session expired. Please log in again.");
            await logout();
            navigate("/");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }, [logout, navigate]);

  return [axiosSecure];
};

export default useAxiosSecure;
