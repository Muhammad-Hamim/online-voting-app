import { useQuery } from "@tanstack/react-query";
import { TUserData } from "@/types/User";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

const useUserInfo = () => {
  const [axiosSecure] = useAxiosSecure();

  const {
    data: user,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<TUserData, Error>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get("/users/me");
        return response.data.data;
      } catch (error) {
        toast.error("Error loading user information.");
        throw error;
      }
    },
    retry: false, // Optional: Disable automatic retries
  });

  return {
    user,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};

export default useUserInfo;
