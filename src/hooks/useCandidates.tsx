/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";
import { IAppliedPositions, TCandidate } from "@/types/candidates";
import useCustomState from "./useCustomState";

const useGetCandidates = () => {
  const { positionId: position } = useCustomState();
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
        const response = await axiosSecure.get(
          `/positions/get-candidate-for-position/${position}`
        );
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
const useMyApplications = (email: string) => {
  const [axiosSecure] = useAxiosSecure();
  // Conditionally fetch data only if position is valid
  const {
    data: appliedPositions = [], // Default to an empty arra,
    isLoading,
    isError,
    refetch,
  } = useQuery<IAppliedPositions[], Error>({
    queryKey: ["my-applications", email], // Include position in the query key
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(
          `/candidates/my-applications/${email}`
        );
        return response.data.data;
      } catch (err) {
        throw new Error("Failed to fetch applications");
      }
    },
    enabled: !!email, // Fetch only if position is truthy
    retry: false, // Optional: Disable automatic retries
  });

  return {
    appliedPositions,

    isLoading,
    isError,
    refetch,
  };
};

export { useGetCandidates, useMyApplications };
