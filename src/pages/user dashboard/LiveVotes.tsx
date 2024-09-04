import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useGetCandidates } from "@/hooks/useCandidates";
import { CirclesWithBar } from "react-loader-spinner";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse, IPosition, TPosition } from "@/types/positions";
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
import { TCandidate } from "@/types/candidates";

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
    return <LoadingSpinner />;
  }

  const { livePositions, notStartedOrExpiredPositions } =
    sortAndCategorizePositions((positions as TPosition[] & IPosition[]) || []);

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8 text-gray-800"
      >
        Live Voting Dashboard
      </motion.h1>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5"
        >
          {livePositions.length > 0 ? (
            livePositions.map((position) => (
              <motion.div
                key={position._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <LiveVoteCard
                  id={position?._id as string}
                  title={position?.title as string}
                  description={position?.description as string}
                  startTime={position?.startTime as string}
                  endTime={position?.endTime as string}
                  status={position?.status as string}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No live positions available.
            </p>
          )}
          {notStartedOrExpiredPositions.length > 0 && (
            <>
              <div className="col-span-full mt-6 md:mt-8 mb-2 md:mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                  Upcoming and Past Positions
                </h2>
              </div>
              {notStartedOrExpiredPositions.map((position) => (
                <motion.div
                  key={position._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <LiveVoteCard
                    id={position?._id as string}
                    title={position?.title as string}
                    description={position?.description as string}
                    startTime={position?.startTime as string}
                    endTime={position?.endTime as string}
                    status={position?.status as string}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[550px] max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
          <DialogHeader className="p-4 md:p-6 bg-white bg-opacity-70 backdrop-blur-sm">
            <DialogTitle className="text-xl md:text-3xl font-extrabold text-gray-800">
              Choose Your Candidate
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-gray-600">
              Select the candidate you believe will best represent this
              position.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] p-4 md:p-6">
            <div className="space-y-3 md:space-y-4 pb-2">
              {candidates && candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate._id}
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate._id}
                    onSelect={() => setSelectedCandidate(candidate?._id)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4 md:py-8">
                  No candidates available at this time.
                </p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="p-4 md:p-6 bg-white bg-opacity-70 backdrop-blur-sm">
            <Button
              onClick={handleVote}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 md:py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-base md:text-lg"
              disabled={!selectedCandidate}
            >Confirm Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CandidateCard = ({
  candidate,
  isSelected,
  onSelect,
}: {
  candidate: TCandidate;
  isSelected: boolean;
  onSelect: () => void;
}) => (
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
        <div className="flex items-center space-x-2 md:space-x-4">
          <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-gray-200">
            <AvatarImage
              src={candidate?.candidate?.photo}
              alt={candidate?.candidate?.name}
            />
            <AvatarFallback>
              <User className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base md:text-xl font-bold text-gray-800">
              {candidate?.candidate?.name}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-500">
              {candidate.email}
            </CardDescription>
          </div>
          {isSelected && (
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-500 ml-auto" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs md:text-sm text-gray-600 italic">
          &ldquo;{candidate.message}&rdquo;
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <CirclesWithBar
      height="60"
      width="60"
      color="#4fa94d"
      outerCircleColor="#4fa94d"
      innerCircleColor="#4fa94d"
      barColor="#4fa94d"
      ariaLabel="circles-with-bar-loading"
      visible={true}
    />
  </div>
);

export default LiveVotes;