/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "@/api/axiosInstance";
import { ErrorResponse } from "@/types/positions";
import { AxiosError } from "axios";

type Inputs = { email: string; password: string };

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  const loginMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const response = await axiosInstance.post("/auth/login", data);
      const token = response.data.data.accessToken;
      localStorage.setItem("token", token);
      return response.data;
    },
    onSuccess: () => {
      navigate("/dashboard"); // Replace with your dashboard route
    },
  });

  const handleLogin: SubmitHandler<Inputs> = (data) => {
    toast.promise(loginMutation.mutateAsync(data), {
      loading: "Logging in...",
      success: "Login successful!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Login failed!",
    });
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#1F3D7A]">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              {...register("email", { required: true })}
              type="email"
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
              Password
            </label>
            <Input
              {...register("password", { required: true })}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D7A]"
            />
            {errors.password?.type === "required" && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                Password is required
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Link
              to={"/forgot-password"}
              className="text-[#1F3D7A] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1F3D7A] to-[#2a4e9b] hover:from-[#2a4e9b] hover:to-[#1F3D7A] text-white rounded-full py-2 transition-colors"
          >
            Login
          </Button>
          <div className="text-center text-sm text-[#1F3D7A]">
            Don't have an account?{" "}
            <Link to={"/registration"} className="font-medium hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
