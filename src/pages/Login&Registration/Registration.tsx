/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "@/api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import profilePhoto from "@/assets/profile/profile.jpg";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type Inputs = {
  name: string;
  email: string;
  studentId: string;
  password: string;
  photo?: FileList;
};

const Registration: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const registrationMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post("/users/create-user", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleRegistration: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    // Append user data as a JSON string
    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        studentId: data.studentId,
      })
    );
    // Append photo file if it exists
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }
    toast.promise(registrationMutation.mutateAsync(formData), {
      loading: "Registering...",
      success: "Registration successful! Please log in.",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Registration failed!",
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-[#1F3D7A]">Register</h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleRegistration)}>
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <Input
              id="name"
              {...register("name", { required: true })}
              type="text"
              placeholder="John Doe"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2560d4]"
            />
            {errors.name && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                Name is required
              </p>
            )}
          </div>
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
            {errors.email && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                Email is required
              </p>
            )}
          </div>
          <div>
            <label htmlFor="student-id" className="block font-medium mb-1">
              Student ID
            </label>
            <Input
              id="student-id"
              {...register("studentId", { required: true })}
              type="text"
              placeholder="F23010101"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-800"
            />
            {errors.studentId && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                Student ID is required
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                {...register("password", { required: true })}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-800"
              />
              {errors.password && (
                <p role="alert" className="text-red-400 text-[14px] mt-3">
                  password is required
                </p>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-indigo-600" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-indigo-600" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="photo" className="block font-medium mb-1">
              Photo
            </label>
            <div className="flex items-center">
              <Input
                id="photo"
                {...register("photo")}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handlePhotoUpload(e);
                  register("photo").onChange(e);
                }}
                className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D7A]"
              />
              <div className="ml-4">
                <img
                  src={photoPreview || profilePhoto}
                  alt="Photo Preview"
                  width={64}
                  height={64}
                  className="rounded-full"
                  style={{ aspectRatio: "1", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1F3D7A] to-[#2a4e9b] hover:from-[#2a4e9b] hover:to-[#1F3D7A] text-white rounded-full py-2 transition-colors"
          >
            Register
          </Button>
          <div className="text-center text-sm text-[#1F3D7A]">
            Already have an account?{" "}
            <Link to={"/"} className="font-medium hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Registration;
