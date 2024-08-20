import axiosInstance from "@/api/axiosInstance";

const useRefreshToken = async () => {
  try {
    const res = await axiosInstance.post("/auth/refresh-token", {});
    return res;
  } catch (error) {
    console.log("Logout request failed", error);
    return false;
  }
};

export default useRefreshToken;
