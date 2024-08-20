import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { useGetMyVotes } from "@/hooks/useVotes";
import { Button } from "@/components/ui/button";
import { CirclesWithBar } from "react-loader-spinner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { TUserData } from "@/types/User";

const VotingHistory: React.FC = () => {
  const { myVotes, isLoading: isMyVotesLoading } = useGetMyVotes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [voteId, setVoteId] = useState("");
  const selectedVote = myVotes?.find((item) => item._id === voteId);
  if (isMyVotesLoading) {
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
      <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <header className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🗳️</span> Voting History
        </header>

        <div className="overflow-x-auto shadow-md rounded-lg">
          {myVotes && myVotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="text-center">#</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Candidate</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myVotes?.map((item, index) => (
                  <TableRow className="text-center" key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.position.title}
                    </TableCell>
                    <TableCell>{item?.candidate?.candidate?.name}</TableCell>
                    <TableCell>
                      {moment(item?.createdAt).format("DD MMM, YY")}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsDialogOpen(true);
                            setVoteId(item._id);
                          }}
                        >
                          view details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No voting history available.
            </div>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:min-w-[30vw] max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-300 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Voting Details
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Here are the details of your vote.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar overflow-y-auto max-h-[60vh] space-y-6 p-6">
            {selectedVote && (
              <>
                {/* Candidate Information Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={selectedVote.candidate?.candidate?.photo}
                    alt={selectedVote.candidate?.candidate?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold">
                      {selectedVote.candidate?.candidate?.name}
                    </h3>
                    <p className="text-md mt-2">
                      {selectedVote.candidate?.candidate?.email}
                    </p>
                    <p className="text-md mt-1">
                      Student ID: {selectedVote.candidate?.candidate?.studentId}
                    </p>
                    <div className="mt-4 flex justify-center sm:justify-start">
                      <span className="bg-white text-indigo-500 font-semibold py-1 px-3 rounded-full shadow-sm">
                        Votes: {selectedVote.candidate?.votes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Position Information Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 relative">
                  <div className="absolute top-0 left-0 bg-purple-500 h-2 w-full rounded-t-xl"></div>
                  <h4 className="text-lg font-semibold text-gray-800 mt-4">
                    Position Details
                  </h4>
                  <div className="mt-3">
                    <p className="text-xl font-bold text-indigo-600">
                      {selectedVote.position?.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedVote.position?.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <img
                      src={
                        (selectedVote?.position?.creator as Partial<TUserData>)
                          ?.photo
                      }
                      className="w-12 h-12 rounded-full object-cover border-4 border-indigo-500 shadow-md"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">
                        Created by:{" "}
                        {
                          (
                            selectedVote?.position
                              ?.creator as Partial<TUserData>
                          )?.name
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        {
                          (
                            selectedVote?.position
                              ?.creator as Partial<TUserData>
                          )?.email
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Voting Time Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 relative">
                  <div className="absolute top-0 left-0 bg-indigo-500 h-2 w-full rounded-t-xl"></div>
                  <h4 className="text-lg font-semibold text-gray-800 mt-4">
                    Voting Time
                  </h4>
                  <p className="text-md text-gray-600 mt-2">
                    {moment(selectedVote.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VotingHistory;
