
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios"; // Import AxiosError type

type Inputs = { email: string; newPassword: string };

// Define an interface for the error response
interface ErrorResponse {
  message: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get("email");
  const token = query.get("token");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      if (!email || !token) {
        throw new Error("Invalid request");
      }
      const response = await axiosInstance.post("/auth/reset-password", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleResetPassword: SubmitHandler<Inputs> = (data) => {
    toast.promise(resetPasswordMutation.mutateAsync(data), {
      loading: "Resetting password...",
      success: "Password reset successful!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to reset password!",
    });
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#1F3D7A]">
          Reset Password
        </h1>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              {...register("email", { required: true })}
              type="email"
              value={email as string}
              readOnly
              placeholder="example@email.com"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D7A]"
            />
            {errors.email?.type === "required" && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                Email is required
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("newPassword", { required: true })}
              placeholder="Enter your new password"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D7A]"
            />
            {errors.newPassword?.type === "required" && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                new password is required
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1F3D7A] to-[#2a4e9b] hover:from-[#2a4e9b] hover:to-[#1F3D7A] text-white rounded-full py-2 transition-colors"
          >
            Reset Password
          </Button>
          <div className="text-center text-sm text-[#1F3D7A]">
            <Link to={"/"} className="font-medium hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
