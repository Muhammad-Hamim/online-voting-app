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
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHistory,
  FaVoteYea,
  FaUserTie,
  FaClock,
  FaEye,
} from "react-icons/fa";

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
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaHistory size={60} className="text-green-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center"
        >
          <FaHistory className="mr-2" /> Voting History
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
          className="overflow-x-auto shadow-md rounded-lg"
        >
          {myVotes && myVotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center">#</TableHead>
                  <TableHead className="text-center">
                    <FaVoteYea className="inline mr-2" />
                    Title
                  </TableHead>
                  <TableHead className="text-center">
                    <FaUserTie className="inline mr-2" />
                    Candidate
                  </TableHead>
                  <TableHead className="text-center">
                    <FaClock className="inline mr-2" />
                    Time
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {myVotes?.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item.position.title}
                      </TableCell>
                      <TableCell>{item?.candidate?.candidate?.name}</TableCell>
                      <TableCell>
                        {moment(item?.createdAt).format("DD MMM, YY")}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsDialogOpen(true);
                                setVoteId(item._id);
                              }}
                              className="flex items-center justify-center"
                            >
                              <FaEye className="mr-2" /> View Details
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-8 text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaHistory size={60} className="text-gray-300 mx-auto mb-4" />
              </motion.div>
              <p className="text-xl text-gray-600">
                No voting history available.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Your voting records will appear here once you've participated in
                an election.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:min-w-[30vw] max-h-[80vh] flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader className="border-b border-gray-300 pb-4">
                  <DialogTitle className="text-lg font-semibold text-gray-800">
                    Voting Details
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    Here are the details of your vote.
                  </DialogDescription>
                </DialogHeader>
              </motion.div>
              <div className="custom-scrollbar overflow-y-auto max-h-[60vh] space-y-6 p-6">
                {selectedVote && (
                  <>
                    {/* Candidate Information Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-center"
                    >
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        src={selectedVote.candidate?.candidate?.photo}
                        alt={selectedVote.candidate?.candidate?.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-center sm:text-left"
                      >
                        <h3 className="text-2xl font-bold">
                          {selectedVote.candidate?.candidate?.name}
                        </h3>
                        <p className="text-md mt-2">
                          {selectedVote.candidate?.candidate?.email}
                        </p>
                        <p className="text-md mt-1">
                          Student ID:{" "}
                          {selectedVote.candidate?.candidate?.studentId}
                        </p>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="mt-4 flex justify-center sm:justify-start"
                        >
                          <span className="bg-white text-indigo-500 font-semibold py-1 px-3 rounded-full shadow-sm">
                            Votes: {selectedVote.candidate?.votes}
                          </span>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Position Information Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white shadow-lg rounded-xl p-6 relative"
                    >
                      <div className="absolute top-0 left-0 bg-purple-500 h-2 w-full rounded-t-xl"></div>
                      <h4 className="text-lg font-semibold text-gray-800 mt-4">
                        Position Details
                      </h4>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-3"
                      >
                        <p className="text-xl font-bold text-indigo-600">
                          {selectedVote.position?.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {selectedVote.position?.description}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="mt-6 flex items-center"
                      >
                        <img
                          src={
                            (
                              selectedVote?.position
                                ?.creator as Partial<TUserData>
                            )?.photo
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
                      </motion.div>
                    </motion.div>

                    {/* Voting Time Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white shadow-lg rounded-xl p-6 relative"
                    >
                      <div className="absolute top-0 left-0 bg-indigo-500 h-2 w-full rounded-t-xl"></div>
                      <h4 className="text-lg font-semibold text-gray-800 mt-4">
                        Voting Time
                      </h4>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="text-md text-gray-600 mt-2"
                      >
                        {moment(selectedVote.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </motion.p>
                    </motion.div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default VotingHistory;
