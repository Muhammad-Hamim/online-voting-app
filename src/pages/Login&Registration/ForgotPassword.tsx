
import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorResponse } from "@/types/positions";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = { email: string };

const ForgotPassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  const forgetPasswordMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const response = await axiosInstance.post("/auth/forget-password", data);
      return response;
    },
    onSuccess: () => {
      toast((t) => (
        <span>
          An Email has been sent to reset your password.
          <div className="mt-2">
            <Button className="mr-2">
              <a
                href="http://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gmail
              </a>
            </Button>
            <Button onClick={() => toast.dismiss(t.id)}>Dismiss</Button>
          </div>
        </span>
      ));
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset email!"
      );
    },
  });

  const handleResetPassword: SubmitHandler<Inputs> = (data) => {
    forgetPasswordMutation.mutate(data);
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#1F3D7A]">
          Forgot Password
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
              type="email"
              {...register("email", { required: true })}
              placeholder="example@email.com"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D7A]"
            />
            {errors.email && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                Email is required
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1F3D7A] to-[#2a4e9b] hover:from-[#2a4e9b] hover:to-[#1F3D7A] text-white rounded-full py-2 transition-colors"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
