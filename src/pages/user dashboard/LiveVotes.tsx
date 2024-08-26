import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAllPositions } from "@/hooks/usePositions";
import { TCandidate } from "@/types/candidates";

import { motion } from "framer-motion";
import { useGetCandidates } from "@/hooks/useCandidates";
import { CirclesWithBar } from "react-loader-spinner";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import useCustomState from "@/hooks/useCustomState";
import { TVoteCreate } from "@/types/vote";
import { useGetMyVotes } from "@/hooks/useVotes";
import { sortAndCategorizePositions } from "@/utils/sortAndCategorizePositions";
import LiveVoteCard from "@/components/my components/VoteCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const LiveVotes = () => {
  const { user, isLoading: isUserLoading } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { positionId } = useCustomState();
  const { refetch: refetchMyVotes } = useGetMyVotes();
  const {
    livePositions: positions,
    isLoading: isPositionLoading,
    isPending: isPositionPending,
  } = useAllPositions("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const { approvedCandidates: candidates, isLoading: isCandidateLoading } =
    useGetCandidates();

  const voteMutation = useMutation({
    mutationFn: async (data: TVoteCreate) => {
      const response = await axiosSecure.post("/votes/create-vote", data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },
    onSuccess: async () => {
      setIsDialogOpen(false);
      refetchMyVotes();
    },
  });

  const handleVote = () => {
    if (!selectedCandidate) {
      return toast.error("Please select a candidate");
    }
    if (!user?._id || !positionId) {
      return toast.error("Please refresh the web page and try again");
    }

    const data = {
      voter: user._id,
      email: user.email,
      candidate: selectedCandidate,
      position: positionId,
    };
    toast.promise(voteMutation.mutateAsync(data as TVoteCreate), {
      loading: "Voting in process...",
      success: "You have successfully voted!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to vote!",
    });
  };

  if (
    isCandidateLoading ||
    isPositionLoading ||
    isPositionPending ||
    isUserLoading
  ) {
    return (
      <div className="absolute w-fit h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CirclesWithBar
          height="80"
          width="80"
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          visible={true}
        />
      </div>
    );
  }

  const { livePositions, notStartedOrExpiredPositions } =
    sortAndCategorizePositions(positions || []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {livePositions.length > 0 ? (
          livePositions.map((position) => (
            <LiveVoteCard
              key={position._id}
              id={position?._id as string}
              title={position?.title as string}
              description={position?.description as string}
              startTime={position?.startTime as string}
              endTime={position?.endTime as string}
              status={position?.status as string}
              setIsDialogOpen={setIsDialogOpen}
            />
          ))
        ) : (
          <p>No live positions available.</p>
        )}
        {notStartedOrExpiredPositions.length > 0 ? (
          notStartedOrExpiredPositions.map((position) => (
            <LiveVoteCard
              key={position._id}
              id={position?._id as string}
              title={position?.title as string}
              description={position?.description as string}
              startTime={position?.startTime as string}
              endTime={position?.endTime as string}
              status={position?.status as string}
              setIsDialogOpen={setIsDialogOpen}
            />
          ))
        ) : (
          <p>No positions available.</p>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] p-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
          <DialogHeader className="p-6 bg-white bg-opacity-70 backdrop-blur-sm">
            <DialogTitle className="text-3xl font-extrabold text-gray-800">
              Choose Your Candidate
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Select the candidate you believe will best represent this
              position.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] p-6">
            <div className="space-y-4">
              {candidates && candidates.length > 0 ? (
                candidates.map((candidate: TCandidate) => (
                  <CandidateCard
                    key={candidate._id}
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate._id}
                    onSelect={() => setSelectedCandidate(candidate._id)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No candidates available at this time.
                </p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 bg-white bg-opacity-70 backdrop-blur-sm">
            <Button
              onClick={handleVote}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-lg"
              disabled={!selectedCandidate}
            >
              Confirm Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveVotes;

const CandidateCard: React.FC<{
  candidate: TCandidate;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ candidate, isSelected, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card
      className={`overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-2 border-gray-500 shadow-lg bg-gray-50"
          : "border-2 border-gray-50 hover:border-gray-100 bg-white"
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-gray-200">
            <AvatarImage
              src={candidate?.candidate?.photo}
              alt={candidate?.candidate?.name}
            />
            <AvatarFallback>
              <User className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              {candidate?.candidate?.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {candidate.email}
            </CardDescription>
          </div>
          {isSelected && (
            <CheckCircle className="w-6 h-6 text-gray-500 ml-auto" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 italic">
          &ldquo;{candidate.message}&rdquo;
        </p>
      </CardContent>
    </Card>
  </motion.div>
);
