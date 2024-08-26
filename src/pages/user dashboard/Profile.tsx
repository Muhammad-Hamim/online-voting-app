"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, Camera, Edit3, Key, Calendar, Clock, Zap } from "lucide-react"
import { useUserInfo } from "@/hooks/useUserInfo"
import moment from "moment"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import useAxiosSecure from "@/hooks/useAxiosSecure"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import useAuth from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"

type PasswordInputs = { oldPassword: string; newPassword: string }
type ProfileUpdateInputs = {
  name?: string
  email?: string
  studentId?: string
  photo?: FileList
}
interface ErrorResponse {
  message: string
}

const Profile = () => {
  const { logout } = useAuth()
  const { user, refetch } = useUserInfo()
  const navigate = useNavigate()
  const [axiosSecure] = useAxiosSecure()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleToggleOldPasswordVisibility = () => setShowOldPassword(prev => !prev)
  const handleToggleNewPasswordVisibility = () => setShowNewPassword(prev => !prev)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm<ProfileUpdateInputs>()

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosSecure.patch("/users/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    },
    onSuccess: async () => {
      refetch()
      setIsDialogOpen(false)
    },
  })

  const handleUpdateProfile: SubmitHandler<ProfileUpdateInputs> = (data) => {
    const formData = new FormData()
    const jsonData: Partial<ProfileUpdateInputs> = {}
    if (data.name) jsonData.name = data.name
    if (data.email) jsonData.email = data.email
    if (data.studentId) jsonData.studentId = data.studentId
    formData.append("data", JSON.stringify(jsonData))
    if (data.photo && data.photo[0]) formData.append("photo", data.photo[0])

    toast.promise(updateProfileMutation.mutateAsync(formData), {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: (error: AxiosError<ErrorResponse>) => error.response?.data?.message || "Failed to update profile!",
    })
  }

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors } } = useForm<PasswordInputs>()

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordInputs) => {
      const response = await axiosSecure.post("/auth/change-password", data)
      return response.data
    },
    onSuccess: async () => {
      toast.success("Password changed successfully. Please log in again.")
      await logout()
      navigate("/")
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to change password!")
    },
  })

  const handleChangePassword: SubmitHandler<PasswordInputs> = (data) => {
    changePasswordMutation.mutate(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl rounded-3xl bg-white bg-opacity-20 backdrop-blur-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center text-indigo-600 md:items-start gap-8">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg"
              >
                <img
                  src={user?.photo || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit3 className="w-6 h-6 text-indigo-600" />
              </motion.div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold text-indigo-800 mb-2">{user?.name}</h2>
              <p className="text-xl text-indigo-100 mb-1">Student ID: {user?.studentId}</p>
              <p className="text-xl text-indigo-100 mb-6">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                <Button onClick={() => setIsDialogOpen(true)} className="bg-white text-indigo-800 hover:bg-indigo-100">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <Button onClick={() => setIsChangePasswordDialogOpen(true)} variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-600">
                  <Key className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
              <div className="space-y-3 text-left text-indigo-100">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Joined: {moment(user?.createdAt).format("MMMM Do, YYYY")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>Last Password Change: {user?.passwordChangedAt ? moment(user?.passwordChangedAt).format("MMMM Do, YYYY, h:mm a") : "Never"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Your Profile</DialogTitle>
            <DialogDescription className="text-indigo-200">
              Update your information and click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProfile(handleUpdateProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                {...registerProfile("name")}
                defaultValue={user?.name}
                className="bg-white bg-opacity-20 border-0 text-white placeholder-indigo-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                {...registerProfile("email")}
                defaultValue={user?.email}
                className="bg-white bg-opacity-20 border-0 text-white placeholder-indigo-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-white">Student ID</Label>
              <Input
                id="studentId"
                {...registerProfile("studentId")}
                defaultValue={user?.studentId}
                className="bg-white bg-opacity-20 border-0 text-white placeholder-indigo-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-white">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  {...registerProfile("photo")}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Label htmlFor="photo" className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
                  <Camera className="h-8 w-8 text-white" />
                </Label>

                  <img
                    src={photoPreview || user?.photo}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-white text-indigo-600 hover:bg-indigo-100">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Change Your Password</DialogTitle>
            <DialogDescription className="text-indigo-200">
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(handleChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-white">Current Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  {...registerPassword("oldPassword", { required: true })}
                  type={showOldPassword ? "text" : "password"}
                  className="bg-white bg-opacity-20 border-0 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handleToggleOldPasswordVisibility}
                >
                  {showOldPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-white" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  {...registerPassword("newPassword", { required: true })}
                  type={showNewPassword ? "text" : "password"}
                  className="bg-white bg-opacity-20 border-0 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={handleToggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-white" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-white text-indigo-600 hover:bg-indigo-100">
                <Zap className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Profile