import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile/profile.jpg";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import useRegister from "@/hooks/useRegistration";

type Inputs = {
  name: string;
  email: string;
  studentId?: string;
  photo?: FileList;
};

const CreateAdminAccount: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const registrationMutation = useRegister("/users/create-admin");

  const handleRegistration: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    // Append user data as a JSON string
    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        email: data.email,
        studentId: data.studentId,
      })
    );
    // Append photo file if it exists
    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }
    toast.promise(registrationMutation.mutateAsync(formData), {
      loading: "Registering...",
      success: (
        <div>
          <p>
            Registration successful! An email with password will be sent to your
            inbox.
          </p>
          <p>
            If you do not receive the email, please wait some time and then use
            the
            <span className="text-blue-500 underline"> Forgot Password </span>
            option to reset your password.
          </p>
        </div>
      ),
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
    <main className="flex-1 flex items-center justify-center my-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold  text-[#1F3D7A]">
          Create admin account
        </h1>
        <p className="text-sm mb-4 text-gray-600">
          If you want to organize an election, please create an admin account.
        </p>
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
              {...register("studentId")}
              type="text"
              placeholder="F23010101"
              className="w-full rounded-full bg-[#E1ECF4] px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-800"
            />
            {errors.studentId && (
              <p role="alert" className="text-red-400 text-[14px] mt-3">
                {errors.studentId.message}
              </p>
            )}
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
            create account
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

export default CreateAdminAccount;
