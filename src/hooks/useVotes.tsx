import useAxiosSecure from "./useAxiosSecure";
import useUserInfo from "./useUserInfo";
import { useQuery } from "@tanstack/react-query";
import { TVotingRecord } from "@/types/vote";
import toast from "react-hot-toast";

const useGetMyVotes = () => {
  const { user } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const {
    data: myVotes,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<TVotingRecord[], Error>({
    queryKey: ["votes"],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get("/votes/get-my-votes");
        return response.data.data;
      } catch (error) {
        toast.error("Error loading votes record.");
        throw error;
      }
    },
    enabled: !!user,
    retry: false, // Optional: Disable automatic retries
  });
  return {
    myVotes,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};

export { useGetMyVotes };
