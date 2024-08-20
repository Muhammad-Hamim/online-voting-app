import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";
import { TCandidate } from "@/types/candidates";
import useCustomState from "./useCustomState";

const useGetCandidates = () => {
  const {positionId:position} = useCustomState();
  const [axiosSecure] = useAxiosSecure();
  // Conditionally fetch data only if position is valid
  const {
    data: candidates,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery<TCandidate[], Error>({
    queryKey: ["candidates", position], // Include position in the query key
    queryFn: async () => {
      if (!position) {
        return []; // Return empty array if position is not valid
      }
      try {
        const response = await axiosSecure.get(`/positions/get-candidate-for-position/${position}`);
        return response.data.data;
      } catch (error) {
        toast.error("Error loading candidates data.");
        throw error;
      }
    },
    enabled: !!position, // Fetch only if position is truthy
    retry: false, // Optional: Disable automatic retries
  });

  const approvedCandidates = candidates?.filter(
    (candidate) => candidate.status === "approved"
  );

  return {
    candidates,
    approvedCandidates,
    error,
    isLoading,
    isError,
    refetch,
  };
};

export default useGetCandidates;
