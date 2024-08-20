import LiveVoteCard from "@/components/my components/VoteCard";
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
import { usePositions } from "@/hooks/usePositions";
import { TCandidate } from "@/types/candidates";
import CandidateCard from "@/components/my components/CandidateCard";
import useGetCandidates from "@/hooks/useGetCandidates";
import { CirclesWithBar } from "react-loader-spinner";
import useUserInfo from "@/hooks/useUserInfo";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";
import useCustomState from "@/hooks/useCustomState";
import { TVoteCreate } from "@/types/vote";

const LiveVotes = () => {
  const { user, isLoading: isUserLoading } = useUserInfo();
  const [axiosSecure] = useAxiosSecure();
  const { positionId } = useCustomState();
  const {
    livePositions: positions,
    isLoading: isPositionLoading,
    isPending: isPositionPending,
  } = usePositions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const { approvedCandidates: candidates, isLoading: isCandidateLoading } =
    useGetCandidates();

  //submit vote function
  const voteMutation = useMutation({
    mutationFn: async (data: TVoteCreate) => {
      const response = await axiosSecure.post("/votes/create-vote", data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },
    onSuccess: async () => {
      setIsDialogOpen(false);
    },
  });

  const handleVote = () => {
    if (!selectedCandidate) {
      return toast.error("Please select a candidate");
    }
    if (!user?._id || !positionId) {
      return toast.error("please refresh the web page and try again");
    }

    const data = {
      voter: user?._id,
      email: user?.email,
      candidate: selectedCandidate,
      position: positionId,
    };
    toast.promise(voteMutation.mutateAsync(data as TVoteCreate), {
      loading: "voting in process...",
      success: "you have successfully voted!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to vote!",
    });
  };
  // loading state
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
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {positions && positions.length > 0 ? (
          positions?.map((position, index) => {
            return (
              <LiveVoteCard
                key={index}
                id={position._id}
                title={position.title}
                description={position.description}
                startTime={position.startTime}
                endTime={position.endTime as string}
                // duration={position.duration}
                status={position.status}
                setIsDialogOpen={setIsDialogOpen}
              />
            );
          })
        ) : (
          <p>No positions available.</p>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:min-w-[30vw] max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-300 pb-4">
            <DialogTitle>Select a candidate</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar overflow-y-auto max-h-[60vh] space-y-4">
            {isDialogOpen && candidates && candidates.length > 0 ? (
              candidates.map((candidate: TCandidate, index: number) => {
                return (
                  <CandidateCard
                    key={index}
                    id={candidate._id}
                    photoUrl={candidate.candidate.photo as string}
                    message={candidate?.message}
                    name={candidate.candidate.name as string}
                    email={candidate.email}
                    selectedCandidate={selectedCandidate}
                    setSelectedCandidate={setSelectedCandidate}
                  />
                );
              })
            ) : (
              <p>No candidates available.</p>
            )}
          </div>
          <DialogFooter className="border-t border-gray-300 pt-4">
            <Button onClick={handleVote} type="submit">
              Submit Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveVotes;
