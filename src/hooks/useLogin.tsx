import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import { useMutation } from "@tanstack/react-query";

type Inputs = { email: string; password: string };

const useLogin = (loginPath: string, redirectPath: string) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: Inputs) => {
      const response = await axiosInstance.post(loginPath, data);
      const token = response.data.data.accessToken;
      localStorage.setItem("token", token);
      return response.data;
    },
    onSuccess: () => {
      navigate(redirectPath);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Login failed!");
    },
  });
};

export default useLogin;
