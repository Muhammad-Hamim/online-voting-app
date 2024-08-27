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

const useGetAllUser = (query: {
  searchTerm: string;
  page: number;
  limit: number;
}) => {
  const { user } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { searchTerm, page, limit } = query;
  const {
    data: users,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<TUserData[], Error>({
    queryKey: ["getAllUsers", searchTerm, page, limit], // Include searchTerm in the queryKey
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(
          `/users?searchTerm=${
            searchTerm ? searchTerm : ""
          }&page${page}&limit=${limit}`
        );
        return response.data.data;
      } catch (error) {
        toast.error("Error loading users data.");
        throw error;
      }
    },
    enabled: !!user, // Only run the query if user is authenticated
    retry: false, // Disable automatic retries
  });

  return {
    users,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  };
};
const useGetSingleUser = (email: string) => {
  const [axiosSecure] = useAxiosSecure();

  const {
    data: user,
    error,
    isLoading,
    isPending,
    isError,
    refetch,
  } = useQuery<Partial<TUserData>, Error>({
    queryKey: ["getAllUsers", email], // Include searchTerm in the queryKey
    queryFn: async () => {
      try {
        const response = await axiosSecure.get(`/users/${email}`);
        return response.data.data;
      } catch (error) {
        toast.error("Error loading users data.");
        throw error;
      }
    },
    enabled: !!email, // Only run the query if user is authenticated
    retry: false, // Disable automatic retries
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






export { useUserInfo, useGetAllUser, useGetSingleUser };
