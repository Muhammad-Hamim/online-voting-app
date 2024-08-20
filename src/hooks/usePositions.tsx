import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";
import { IPosition, TPosition } from "@/types/positions";
import useUserInfo from "./useUserInfo";
const usePositions = () => {
  const { user } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const {
    data: positions,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<TPosition[], Error>({
    queryKey: ["positions"],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get("/positions");
        return response.data.data;
      } catch (error) {
        toast.error("Error loading positions data.");
        throw error;
      }
    },
    enabled: !!user,
    retry: false, // Optional: Disable automatic retries
  });

  const pendingPositions = positions?.filter(
    (position) => position.status === "pending"
  );
  const livePositions = positions?.filter(
    (position) => position.status === "live"
  );
  const closedPositions = positions?.filter(
    (position) => position.status === "closed"
  );
  return {
    positions,
    livePositions,
    pendingPositions,
    closedPositions,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};

const useGetPositionsWithCandidates = () => {
  const { user } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();

  const {
    data: positions,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<IPosition[], Error>({
    queryKey: ["positions-with-candidates"],
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(
          "/positions/get-positions-with-candidates"
        );
        return response.data.data;
      } catch (error) {
        toast.error("Error loading positions data.");
        throw error;
      }
    },
    enabled: !!user,
    retry: false, // Optional: Disable automatic retries
  });

  const closedPositionsWithApprovedCandidates = positions?.filter((position)=>position.status==='closed');

  return {
    positions,
    closedPositionsWithApprovedCandidates,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};

export { usePositions, useGetPositionsWithCandidates };
