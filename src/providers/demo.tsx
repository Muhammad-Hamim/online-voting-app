import React, { useState } from "react";
import { format } from "date-fns";
import { useMyApplications } from "@/hooks/useCandidates";
import { useUserInfo } from "@/hooks/useUserInfo";
import { IAppliedPositions } from "@/types/candidates";
import { motion } from "framer-motion";
import { Check, X, AlertTriangle, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const statusIcons = {
  approved: <Check className="w-5 h-5 text-green-500" />,
  rejected: <X className="w-5 h-5 text-red-500" />,
  applied: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const ApplicationCard = ({ application }: { application: IAppliedPositions }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMessage, setEditMessage] = useState(application.message || "");

  const handleEditMessage = () => {
    setIsDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {application.positionDetails.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Applied: {format(new Date(application?.createdAt as string), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {statusIcons[application.status as keyof typeof statusIcons]}
          <span className="text-sm font-medium capitalize">{application.status}</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Votes: {application.votes}/{application.positionDetails.maxVotes}
        </span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
              <Edit className="w-4 h-4 mr-1" /> Edit Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Application Message</DialogTitle>
            </DialogHeader>
            <Input
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              placeholder="Enter your message"
            />
            <Button onClick={handleEditMessage}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

const MyAppliedPositions = () => {
  const { user, isLoading: isUserLoading } = useUserInfo();
  const { appliedPositions, isLoading: isAppliedPositionLoading } = useMyApplications(user?.email || "");

  if (isUserLoading || isAppliedPositionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">My Applications</h1>
      <div className="space-y-4">
        {appliedPositions.map((application) => (
          <ApplicationCard key={application._id} application={application} />
        ))}
      </div>
    </div>
  );
};

export default MyAppliedPositions;