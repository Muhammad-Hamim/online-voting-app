"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  EyeIcon,
  EyeOffIcon,
  Camera,
  Edit3,
  Key,
  Calendar,
  Clock,
  Zap,
  Mail,
  User,
} from "lucide-react";
import { useUserInfo } from "@/hooks/useUserInfo";
import moment from "moment";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "@/types/positions";

type PasswordInputs = { oldPassword: string; newPassword: string };
type ProfileUpdateInputs = {
  name?: string;
  email?: string;
  studentId?: string;
  photo?: FileList;
};

export default function Profile() {
  const { logout } = useAuth();
  const { user, refetch } = useUserInfo();
  const navigate = useNavigate();
  const [axiosSecure] = useAxiosSecure();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleToggleOldPasswordVisibility = () =>
    setShowOldPassword((prev) => !prev);
  const handleToggleNewPasswordVisibility = () =>
    setShowNewPassword((prev) => !prev);

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
  const { register: registerProfile, handleSubmit: handleSubmitProfile } =
    useForm<ProfileUpdateInputs>();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosSecure.patch("/users/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: async () => {
      refetch();
      setIsDialogOpen(false);
    },
  });

  const handleUpdateProfile: SubmitHandler<ProfileUpdateInputs> = (data) => {
    const formData = new FormData();
    const jsonData: Partial<ProfileUpdateInputs> = {};
    if (data.name) jsonData.name = data.name;
    if (data.email) jsonData.email = data.email;
    if (data.studentId) jsonData.studentId = data.studentId;
    formData.append("data", JSON.stringify(jsonData));
    // Append photo file if it exists
    // Handle file upload
    if (data.photo && data.photo.length > 0) {
      const file = data.photo[0]; // Get the first file
      console.log("File to upload:", file); // Check the file object
      formData.append("photo", file);
    } else {
      console.log("No file selected");
    }
    toast.promise(updateProfileMutation.mutateAsync(formData), {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to update profile!",
    });
  };

  const { register: registerPassword, handleSubmit: handleSubmitPassword } =
    useForm<PasswordInputs>();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordInputs) => {
      const response = await axiosSecure.post("/auth/change-password", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Password changed successfully. Please log in again.");
      await logout();
      navigate("/");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to change password!"
      );
    },
  });

  const handleChangePassword: SubmitHandler<PasswordInputs> = (data) => {
    toast.promise(changePasswordMutation.mutateAsync(data), {
      loading: "changing password",
      success: "Password changed successfully. Please log in again.",
      error: (error: AxiosError<ErrorResponse>) =>
        error?.response?.data.message || "failed to change password",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl rounded-3xl bg-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Avatar className="w-48 h-48 border-4 border-indigo-200 shadow-lg">
                <AvatarImage
                  src={user?.photo || "/placeholder.svg"}
                  alt="Profile"
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <motion.div
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit3 className="w-6 h-6 text-indigo-600" />
              </motion.div>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold text-indigo-800 mb-2">
                {user?.name}
              </h2>
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center text-indigo-600">
                  <User className="w-5 h-5 mr-2" />
                  <span className="text-lg">Student ID: {user?.studentId}</span>
                </div>
                <div className="flex items-center text-indigo-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span className="text-lg">{user?.email}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                  variant="outline"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  <Key className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
              <div className="space-y-3 text-left text-indigo-600">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>
                    Joined: {moment(user?.createdAt).format("MMMM Do, YYYY")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>
                    Last Password Change:{" "}
                    {user?.passwordChangedAt
                      ? moment(user?.passwordChangedAt).format(
                          "MMMM Do, YYYY, h:mm a"
                        )
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-800">
              Edit Your Profile
            </DialogTitle>
            <DialogDescription className="text-indigo-600">
              Update your information and click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitProfile(handleUpdateProfile)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-indigo-800">
                Name
              </Label>
              <Input
                id="name"
                {...registerProfile("name")}
                defaultValue={user?.name}
                className="border-indigo-200 focus:border-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-800">
                Email
              </Label>
              <Input
                id="email"
                {...registerProfile("email")}
                defaultValue={user?.email}
                className="border-indigo-200 focus:border-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-indigo-800">
                Student ID
              </Label>
              <Input
                id="studentId"
                {...registerProfile("studentId")}
                defaultValue={user?.studentId}
                className="border-indigo-200 focus:border-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-indigo-800">
                Profile Photo
              </Label>
              <div className="flex relative items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  {...registerProfile("photo")}
                  onChange={handlePhotoUpload}
                  className="w-24"
                />
                <Label
                  htmlFor="photo"
                  className="cursor-pointer absolute left-0 top-0 flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors"
                >
                  <Camera className="h-8 w-8 text-indigo-600" />
                </Label>
                {(photoPreview || user?.photo) && (
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={photoPreview || user?.photo}
                      alt="Preview"
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-800">
              Change Your Password
            </DialogTitle>
            <DialogDescription className="text-indigo-600">
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitPassword(handleChangePassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-indigo-800">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  {...registerPassword("oldPassword", { required: true })}
                  type={showOldPassword ? "text" : "password"}
                  className="border-indigo-200 focus:border-indigo-600 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handleToggleOldPasswordVisibility}
                >
                  {showOldPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-indigo-600" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-indigo-800">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  {...registerPassword("newPassword", { required: true })}
                  type={showNewPassword ? "text" : "password"}
                  className="border-indigo-200 focus:border-indigo-600 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handleToggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-indigo-600" />
                  )}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Zap className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
