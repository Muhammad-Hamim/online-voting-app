/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";
import { IPosition, TPosition } from "@/types/positions";
import { useUserInfo } from "./useUserInfo";

// Helper function to fetch positions
const fetchPositions = async (axiosSecure: any, endpoint: string) => {
  try {
    const response = await axiosSecure.get(endpoint);
    return response.data.data;
  } catch (error) {
    toast.error("Error loading positions data.");
    throw error;
  }
};

// Hook for updating the position status
const useUpdatePositionStatus = () => {
  const queryClient = useQueryClient();
  const [axiosSecure] = useAxiosSecure();
  // Mutation for updating position status
  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
      terminationMessage,
    }: {
      id: string;
      status: string;
      terminationMessage?: string;
    }): Promise<Record<string, unknown>> => {
      const payload = { status, terminationMessage };
      const response = await axiosSecure.patch(
        `/positions/update-status/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Position status updated successfully!");
      // Correctly invalidate queries by passing the key as a string or array of strings
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({
        queryKey: ["positions-with-candidates"],
      });
    },
    onError: (error: AxiosError) => {
      toast.error(`Error updating position status: ${error.message}`);
    },
  });

  const checkAndUpdatePositionStatus = (position: TPosition) => {
    const currentTime = new Date().getTime();

    if (
      position.endTime &&
      new Date(position.endTime).getTime() <= currentTime &&
      position.status === "live"
    ) {
      mutation.mutate({ id: position._id, status: "closed" });
    } else if (
      position.startTime &&
      new Date(position.startTime).getTime() <= currentTime &&
      position.status === "pending"
    ) {
      mutation.mutate({ id: position._id, status: "live" });
    }
  };

  return {
    mutation,
    checkAndUpdatePositionStatus,
  };
};

// General hook to get positions with optional filters
const usePositions = (endpoint: string, queryKey: string) => {
  const { user } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();

  const {
    data: positions,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<TPosition[] & IPosition[], Error>({
    queryKey: [queryKey],
    queryFn: () => fetchPositions(axiosSecure, endpoint),
    enabled: !!user,
    retry: false,
  });

  return {
    positions,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};

// Hook for positions with candidates
const useGetPositionsWithCandidates = () => {
  const { positions, ...rest } = usePositions(
    "/positions/get-positions-with-candidates",
    "positions-with-candidates"
  );

  const closedPositionsWithApprovedCandidates = positions?.filter(
    (position) => position.status === "closed"
  );

  return {
    positions,
    closedPositionsWithApprovedCandidates,
    ...rest,
  };
};

// Hook for all positions
const useAllPositions = (searchTerm: string) => {
  const { positions, ...rest } = usePositions(
    `/positions/get-positions-with-candidates-and-voters?sort=-endTime&searchTerm=${
      searchTerm ? searchTerm : ""
    }`,
    "positions"
  );

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
    pendingPositions,
    livePositions,
    closedPositions,
    ...rest,
  };
};

export {
  useAllPositions,
  useGetPositionsWithCandidates,
  useUpdatePositionStatus,
};
