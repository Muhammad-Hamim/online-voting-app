"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMyApplications } from "@/hooks/useCandidates";
import { useUserInfo } from "@/hooks/useUserInfo";
import { IAppliedPositions } from "@/types/candidates";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEdit,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const statusIcons = {
  approved: <FaCheckCircle className="text-green-500" />,
  rejected: <FaTimesCircle className="text-red-500" />,
  applied: <FaHourglassHalf className="text-yellow-500" />,
};

const ApplicationCard = ({
  application,
}: {
  application: IAppliedPositions;
}) => {
  const { positionDetails, creator, createdAt, status, message, votes } =
    application;
  const [editMessage, setEditMessage] = useState(message);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditMessage = () => {
    // Implement the logic to update the message
    console.log("Updating message:", editMessage);
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105">
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-1 text-indigo-500">
          {positionDetails.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {positionDetails.description}
        </p>

        <div className="flex items-center mb-4">
          <Avatar className="mr-3">
            <AvatarImage src={creator.photo} alt={creator.name} />
            <AvatarFallback>{creator?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{creator.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {creator.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <FaClock className="text-gray-400 mr-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Applied: {format(new Date(createdAt as string), "PPP")}
            </p>
          </div>
          <div className="flex items-center">
            <FaClock className="text-gray-400 mr-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Created: {format(new Date(positionDetails.createdAt as string), "PPP")}
            </p>
          </div>
          <div className="flex items-center">
            <FaClock className="text-gray-400 mr-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Start: {format(new Date(positionDetails?.startTime as string), "PPP")}
            </p>
          </div>
          <div className="flex items-center">
            <FaClock className="text-gray-400 mr-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              End: {format(new Date(positionDetails?.endTime as string), "PPP")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {statusIcons[status]}
            <span className="ml-2 font-medium capitalize">{status}</span>
          </div>
          <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
            Position Status: {positionDetails.status}
          </span>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex justify-between items-center">
            <p className="text-xs italic">{message}</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                  <FaEdit className="mr-1" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Message</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleEditMessage} className="mt-2">
                  Save Changes
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 px-5 py-4">
        <div className="flex justify-between text-xs mb-2">
          <span>Votes: {votes}</span>
          <span>Max Votes: {positionDetails.maxVotes}</span>
          <span>Max Candidates: {positionDetails.maxCandidates}</span>
        </div>
        <Progress
          value={(votes / (positionDetails?.maxVotes as number)) * 100}
          className="h-2 rounded"
        />
      </div>
    </div>
  );
};

export default function MyAppliedPositions() {
  const { user, isLoading: isUserLoading } = useUserInfo();
  const { appliedPositions, isLoading: isAppliedPositionLoading } =
    useMyApplications(user?.email as string);

  if (isUserLoading || isAppliedPositionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        My Applications
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {appliedPositions.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}
      </div>
    </div>
  );
}
