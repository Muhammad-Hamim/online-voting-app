import { useState } from "react";
import { format } from "date-fns";
import { useMyApplications } from "@/hooks/useCandidates";
import { useUserInfo } from "@/hooks/useUserInfo";
import { IAppliedPositions } from "@/types/candidates";
import {
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  User,
  Mail,
  Calendar,
  Briefcase,
  Check,
  ArrowRight,
  MessageSquarePlus,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";

const statusIcons = {
  approved: <CheckCircle className="text-green-500" />,
  rejected: <XCircle className="text-red-500" />,
  applied: <Check className="text-yellow-500" />,
};
type ApplicationCardProps = {
  application: IAppliedPositions;
  refetch: () => void;
};
const ApplicationCard = ({ application, refetch }: ApplicationCardProps) => {
  const [axiosSecure] = useAxiosSecure();
  const { positionDetails, creator, createdAt, status, message, votes } =
    application;
  const [editMessage, setEditMessage] = useState(message);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await axiosSecure.patch(
        `/candidates/update-message/${application._id}`,
        { message }
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleEditMessage = () => {
    toast.promise(
      updateMessageMutation.mutateAsync({ message: editMessage as string }),
      {
        loading: "Updating message...",
        success: "Message updated successfully",
        error: (error: AxiosError<ErrorResponse>) =>
          error.response?.data?.message || "Failed to update message!",
      }
    );
    setIsDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 border-none rounded-xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{positionDetails.title}</h2>
          <Badge
            variant="secondary"
            className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-indigo-600"
          >
            {positionDetails.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {positionDetails.description}
        </p>

        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={creator.photo} alt={creator.name} />
            <AvatarFallback>{creator?.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold flex items-center text-gray-800 dark:text-gray-200">
              <User className="w-4 h-4 mr-2" /> {creator.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Mail className="w-4 h-4 mr-2" /> {creator.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: Calendar,
              label: "Applied",
              value: format(new Date(createdAt as string), "MMM d, yyyy"),
            },
            {
              icon: Briefcase,
              label: "Created",
              value: format(
                new Date(positionDetails.createdAt as string),
                "MMM d, yyyy"
              ),
            },
            {
              icon: Clock,
              label: "Start Date",
              value: format(
                new Date(positionDetails?.startTime as string),
                "MMM d, yyyy"
              ),
            },
            {
              icon: Clock,
              label: "End Date",
              value: format(
                new Date(positionDetails?.endTime as string),
                "MMM d, yyyy"
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
            >
              <item.icon className="text-indigo-500 mr-2 w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            {statusIcons[status]}
            <span className="ml-2 font-semibold capitalize text-gray-800 dark:text-gray-200">
              {status}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
          >
            View Details <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {message ? "Your Message" : "No Message"}
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                >
                  {message ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus className="w-4 h-4 mr-2" /> Add Message
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {message ? "Edit Message" : "Add Message"}
                  </DialogTitle>
                </DialogHeader>
                <Textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="min-h-[120px] mt-4"
                  placeholder="Enter your message here..."
                />
                <Button
                  onClick={handleEditMessage}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          {message ? (
            <p className="text-sm italic text-gray-600 dark:text-gray-300">
              {message}
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No message added yet.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700 p-6">
        <div className="w-full">
          <div className="flex justify-between text-sm mb-3">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Votes: {votes}
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Max Votes: {positionDetails.maxVotes}
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Max Candidates: {positionDetails.maxCandidates}
            </span>
          </div>
          <Progress
            value={(votes / (positionDetails?.maxVotes as number)) * 100}
            className="h-2 rounded-full bg-gray-200 dark:bg-gray-600"
          >
            <div className="h-full bg-indigo-600 rounded-full"></div>
          </Progress>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function MyAppliedPositions() {
  const { user, isLoading: isUserLoading } = useUserInfo();
  const {
    appliedPositions,
    isLoading: isAppliedPositionLoading,
    refetch,
  } = useMyApplications(user?.email as string);

  if (isUserLoading || isAppliedPositionLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">
        My Applications
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {appliedPositions.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
}
