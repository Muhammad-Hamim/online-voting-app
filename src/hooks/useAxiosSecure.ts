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
      } else {
        logout();
        navigate("/");
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
            if (response?.data?.data?.accessToken) {
              const newAccessToken = response.data.data.accessToken;
              localStorage.setItem("token", newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              // Retry the original request with the new token
              return axiosSecure(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }

          // If refresh failed, log out the user and redirect to login
          toast.error("Session expired. Please log in again.");
          await logout();
          navigate("/");
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  }, [logout, navigate]);

  return [axiosSecure];
};

export default useAxiosSecure;
