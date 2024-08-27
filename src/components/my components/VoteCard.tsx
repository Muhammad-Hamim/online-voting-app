import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useCustomState from "@/hooks/useCustomState";
import useTimer from "@/hooks/useTimer";
import { Vote } from "lucide-react";

type Position = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  description: string;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const LiveVoteCard = ({
  id,
  title,
  startTime,
  endTime,
  status,
  description,
  setIsDialogOpen,
}: Position) => {
  const { setPositionId } = useCustomState();
  const { timeLeft, isVotingAllowed } = useTimer(startTime, endTime);

  const handleVoteClick = () => {
    if (!isVotingAllowed) {
      toast.error("Voting has ended or has not started yet.");
      return;
    }
    setIsDialogOpen(true);
    setPositionId(id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-bl-full opacity-20 z-0"></div>
          <CardHeader className="relative z-10 pb-0">
            <div className="absolute top-4 right-4">
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  status === "live"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {status}
              </motion.span>
            </div>
            <CardTitle className="text-3xl font-extrabold text-gray-800 mb-2">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-gray-600">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6 relative z-10">
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-inner">
              <p className="text-sm font-semibold mb-4 text-center text-gray-700">
                Time Remaining
              </p>
              <div className="flex justify-center space-x-4 text-lg font-mono">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <React.Fragment key={unit}>
                    <motion.div
                      className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-xl text-white shadow-md flex flex-col items-center"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 360 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        repeat: Infinity,
                        repeatDelay: 20,
                      }}
                    >
                      <span className="text-2xl font-bold">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-xs mt-1">{unit}</span>
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6 pb-8 relative z-10">
            <Button
              className={`w-full py-4 rounded-full text-white font-bold text-lg transition-all duration-300 ${
                isVotingAllowed
                  ? "bg-gray-800 hover:bg-gray-900 transform hover:-translate-y-1 hover:shadow-xl"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleVoteClick}
              disabled={!isVotingAllowed}
            >
              <Vote className="mr-2 h-6 w-6" /> Cast Your Vote
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};

export default LiveVoteCard;
