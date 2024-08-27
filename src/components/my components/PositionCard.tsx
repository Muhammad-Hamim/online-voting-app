"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUserInfo } from "@/hooks/useUserInfo";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import moment from "moment";
import { AxiosError } from "axios";
import { ErrorResponse, IPosition, TPosition } from "@/types/positions";
import { TCandidateApplication } from "@/types/candidates";
import { Clock, Users, UserPlus, Calendar, ChevronRight } from "lucide-react";

interface PositionCardProps {
  position: TPosition & IPosition;
  refetch: () => void;
}

const PositionCard: React.FC<PositionCardProps> = ({ position, refetch }) => {
  const {
    _id: id,
    title,
    description,
    startTime: deadline,
    appliedCandidates,
    maxCandidates,
    maxVotes,
  } = position;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDeadlinePassed = moment().isAfter(deadline);
  const { user } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm<TCandidateApplication>();

  const applyCandidateMutation = useMutation({
    mutationFn: async (data: TCandidateApplication) => {
      const response = await axiosSecure.post(
        "/candidates/create-candidate",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      refetch();
      reset();
    },
  });

  const handleApplyCandidate: SubmitHandler<{ message: string }> = (data) => {
    const applicationData: TCandidateApplication = {
      candidate: user?._id as string,
      email: user?.email as string,
      position: id,
      ...data,
    };
    toast.promise(applyCandidateMutation.mutateAsync(applicationData), {
      loading: "Applying...",
      success: "Applied successfully!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to apply!",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto my-6 sm:max-w-md perspective"
    >
      <Card className="relative overflow-hidden h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-indigo-50 transform hover:rotate-y-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-bl-full opacity-20 z-0"></div>
        <CardHeader className="relative z-10 p-6">
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 p-6 flex-grow">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              icon={<Users className="w-5 h-5 text-purple-500" />}
              label="Max Candidates"
              value={maxCandidates}
            />
            <InfoItem
              icon={<UserPlus className="w-5 h-5 text-indigo-500" />}
              label="Applied"
              value={appliedCandidates as number}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5 text-pink-500" />}
              label="Max Voters"
              value={maxVotes}
            />
            <InfoItem
              icon={<Clock className="w-5 h-5 text-blue-500" />}
              label="Deadline"
              value={moment(deadline).format("MMM D, YYYY")}
            />
          </div>
        </CardContent>
        <CardFooter className="relative z-10 p-6">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className={`w-full rounded-full py-6 text-lg font-semibold transition-all duration-300 ${
              isDeadlinePassed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transform hover:-translate-y-1 hover:shadow-lg"
            }`}
            disabled={isDeadlinePassed}
          >
            {isDeadlinePassed ? (
              "Application Closed"
            ) : (
              <span className="flex items-center justify-center">
                Apply Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Apply for {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Share your vision and qualifications for this role.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleApplyCandidate)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700"
                >
                  Why should people vote for you?
                </Label>
                <Textarea
                  id="message"
                  {...register("message", { required: true })}
                  placeholder="Share your qualifications and vision..."
                  className="h-32 resize-none rounded-xl border-purple-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full py-2 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 bg-white bg-opacity-50 rounded-xl p-3 shadow-sm">
    <div className="bg-white rounded-full p-2 shadow-inner">{icon}</div>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default PositionCard;
