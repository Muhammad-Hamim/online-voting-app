import useAxiosSecure from "./useAxiosSecure";
import { useUserInfo } from "./useUserInfo";
import { useQuery } from "@tanstack/react-query";
import { TVotingRecord } from "@/types/vote";
import toast from "react-hot-toast";

const useGetMyVotes = () => {
  const { user, isLoading: isUserLoading } = useUserInfo();
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
    enabled: !isUserLoading && !!user?.email,
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


const useGetSingleUserVotes = (email: string) => {
  const [axiosSecure] = useAxiosSecure();

  const {
    data: userVotes,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<TVotingRecord[], Error>({
    queryKey: ["user-votes", email],
    queryFn: async ({ queryKey }) => {
      const [, email] = queryKey; // Extract email from queryKey
      if (!email) return [];

      try {
        const response = await axiosSecure.get(
          `/votes/single-user-votes/${email}`
        );
        return response.data.data;
      } catch (error) {
        toast.error("Error loading votes record.");
        throw error;
      }
    },
    enabled: !!email, // Ensure the query runs only if email is provided
    retry: false, // Optional: Disable automatic retries
  });

  return {
    userVotes,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};

export { useGetMyVotes,useGetSingleUserVotes };
