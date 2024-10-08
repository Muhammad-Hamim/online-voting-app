
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link} from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import useLogin from "@/hooks/useLogin";

type Inputs = { email: string; password: string };

const AdminLogin = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();

  const loginMutation = useLogin("/auth/admin-login", "/dashboard");

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
        <h1 className="text-3xl font-bold mb-6 text-[#1F3D7A]">Admin Login</h1>
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
          {/* <div className="text-center text-sm text-[#1F3D7A]">
            Don't have an account?{" "}
            <Link to={"/registration"} className="font-medium hover:underline">
              Register here
            </Link>
          </div> */}
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
