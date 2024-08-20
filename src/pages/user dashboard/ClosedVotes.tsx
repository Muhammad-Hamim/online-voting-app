import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetPositionsWithCandidates } from "@/hooks/usePositions";
import { CirclesWithBar } from "react-loader-spinner";
import ClosedVoteCard from "@/components/my components/ClosedVoteCard";
import { ICandidate } from "@/types/positions";
const ClosedVotes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [positionId, setPositionId] = useState("");
  const { closedPositionsWithApprovedCandidates: positions, isLoading } =
    useGetPositionsWithCandidates();
console.log(positions)
  const candidates = positions?.find(
    (position) => position._id === positionId
  )?.candidates;

  if (isLoading) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-5">
        {positions?.map((position, index) => {
          return (
            <ClosedVoteCard
              key={index}
              id={position._id}
              title={position.title}
              description={position.description}
              winner={position.winner as ICandidate}
              setIsDialogOpen={setIsDialogOpen}
              setPositionId={setPositionId}
            />
          );
        })}
      </div>
      {/* Modal */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
      >
        <DialogContent className="sm:min-w-[35vw]">
          <DialogTitle className="text-2xl font-bold mb-4">
            Candidate List
          </DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {candidates?.map((candidate, index) => (
              <div
                key={index}
                className="flex items-center bg-gradient-to-r from-white to-gray-100 shadow-md p-4 rounded-lg border border-gray-200"
              >
                <div className="flex-shrink-0">
                  <img
                    src={candidate?.photo}
                    alt={candidate?.name}
                    className="w-16 h-16 rounded-full border-4 border-teal-500 shadow-md"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <span className="block text-gray-800 font-semibold text-lg">
                    {candidate?.name}
                  </span>
                  <p className="text-gray-600 text-sm mt-1">
                    {candidate?.votes} votes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClosedVotes;
