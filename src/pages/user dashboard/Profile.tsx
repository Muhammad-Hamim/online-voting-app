import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { useState } from "react";
import profilePhoto from "@/assets/profile/profile.jpg";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import useUserInfo from "@/hooks/useUserInfo";
import moment from "moment";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type PasswordInputs = { oldPassword: string; newPassword: string };
type ProfileUpdateInputs = {
  name?: string;
  email?: string;
  studentId?: string;
  photo?: FileList;
};
interface ErrorResponse {
  message: string;
}

const Profile = () => {
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

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword((prevState) => !prevState);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
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

  // Profile update form
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

    // Create a JSON object with only the fields provided by the user
    const jsonData: Partial<ProfileUpdateInputs> = {};

    if (data.name) {
      jsonData.name = data.name;
    }
    if (data.email) {
      jsonData.email = data.email;
    }
    if (data.studentId) {
      jsonData.studentId = data.studentId;
    }
    // Append the JSON data as a string
    formData.append("data", JSON.stringify(jsonData));

    if (data.photo && data.photo[0]) {
      formData.append("photo", data.photo[0]);
    }

    toast.promise(updateProfileMutation.mutateAsync(formData), {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to update profile!",
    });
  };

  // Password change form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordInputs>();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordInputs) => {
      const response = await axiosSecure.post("/auth/change-password", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Password changed successfully. Please log in again.");
      await logout();
      navigate("/"); // Redirect to the login page
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to change password!"
      );
    },
  });

  const handleChangePassword: SubmitHandler<PasswordInputs> = (data) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="bg-primary rounded-t-lg p-6 flex flex-col items-center">
          <Avatar className="w-20 h-20 border-4 border-background">
            <AvatarImage src={user?.photo || profilePhoto} alt="Profile" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold text-primary-foreground">
              {user?.name}
            </h3>
            <p className="text-sm text-primary-foreground">
              Student ID: {user?.studentId}
            </p>
            <p className="text-sm text-primary-foreground">{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-center gap-2">
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              Update Profile
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsChangePasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Joined:</span>
              <span>{moment(user?.createdAt).format("MMM Do, YYYY")}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Password Change:</span>
              <span>
                {user?.passwordChangedAt
                  ? moment(user?.passwordChangedAt).format(
                      "MMM Do, YYYY, hh:mm a"
                    )
                  : moment(user?.createdAt).format("MMM Do, YYYY, hh:mm a")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update any fields you want to change, then save your changes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitProfile(handleUpdateProfile)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  {...registerProfile("name")}
                  defaultValue={user?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  {...registerProfile("email")}
                  defaultValue={user?.email}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="studentId" className="text-right">
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  {...registerProfile("studentId")}
                  defaultValue={user?.studentId}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="photo" className="text-right">
                  Photo
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    {...registerProfile("photo")}
                    onChange={handlePhotoUpload}
                  />
                  <div className="ml-4">
                    <img
                      src={photoPreview || user?.photo || profilePhoto}
                      alt="Photo Preview"
                      width={64}
                      height={64}
                      className="rounded-full"
                      style={{ aspectRatio: "1", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your old password and new password to change your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(handleChangePassword)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="oldPassword" className="text-right">
                  Old Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="oldPassword"
                    {...registerPassword("oldPassword", { required: true })}
                    type={showOldPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleToggleOldPasswordVisibility}
                  >
                    {showOldPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeOffIcon className="w-5 h-5" />
                    )}
                  </Button>
                  {passwordErrors.oldPassword?.type === "required" && (
                    <p role="alert" className="text-red-400 text-[14px] mt-3">
                      Old password is required
                    </p>
                  )}
                </div>
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="newPassword"
                    {...registerPassword("newPassword", { required: true })}
                    type={showNewPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleToggleNewPasswordVisibility}
                  >
                    {showNewPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeOffIcon className="w-5 h-5" />
                    )}
                  </Button>
                  {passwordErrors.newPassword?.type === "required" && (
                    <p role="alert" className="text-red-400 text-[14px] mt-3">
                      New password is required
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
