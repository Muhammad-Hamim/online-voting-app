import AdminLiveVoteCard from "@/components/my components/AdminLiveVoteCard";
import { useAllPositions } from "@/hooks/usePositions";
import { sortAndCategorizePositions } from "@/utils/sortAndCategorizePositions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import useCustomState from "@/hooks/useCustomState";
import { Link } from "react-router-dom";

const AdminLiveVotes = () => {
  const {
    livePositions: positions,
    isLoading: isPositionLoading,
    isPending: isPositionPending,
  } = useAllPositions("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { positionId } = useCustomState();

  const approvedCandidates = positions
    ?.find((position) => position._id === positionId)
    ?.candidates?.filter((candidate) => candidate.status === "approved");

  const { livePositions, notStartedOrExpiredPositions } =
    sortAndCategorizePositions(positions || []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {isPositionLoading || isPositionPending ? (
          <div className="col-span-full flex justify-center items-center">
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
        ) : (
          <>
            {livePositions.length > 0 ? (
              livePositions.map((position) => (
                <AdminLiveVoteCard
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
                <AdminLiveVoteCard
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
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:min-w-[35vw] max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-300 pb-4">
            <DialogTitle>Select a candidate</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar overflow-y-auto max-h-[60vh] space-y-4">
            {isDialogOpen && approvedCandidates ? (
              approvedCandidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-center"
                >
                  <img
                    src={candidate?.photo}
                    alt={candidate?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold">{candidate?.name}</h3>
                    <p className="text-md mt-2">{candidate?.email}</p>
                    <p className="text-md mt-1">
                      Student ID: {candidate?.studentId}
                    </p>
                    <div className="mt-4 flex justify-center sm:justify-start">
                      <span className="bg-white text-indigo-500 font-semibold py-1 px-3 rounded-full shadow-sm">
                        Votes: {candidate?.votes}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No candidates available.</p>
            )}
          </div>
          <DialogFooter className="border-t border-gray-300 pt-4">
            <Link to={`/admin-dashboard/positions/see-details/${positionId}`}>
              <Button type="submit">See Details</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminLiveVotes;
