import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const useRegister = (endpoint: string) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post(endpoint, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/");
    },
  });
};

export default useRegister;
