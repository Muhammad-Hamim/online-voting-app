import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCustomState from "@/hooks/useCustomState";
import useTimer from "@/hooks/useTimer";

type Position = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  description: string;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminLiveVoteCard = ({
  id,
  title,
  startTime,
  endTime,
  status,
  description,
  setIsDialogOpen,
}: Position) => {
  const { setPositionId } = useCustomState();
  const { timeLeft } = useTimer(startTime, endTime);

  const handleVoteClick = () => {
    setIsDialogOpen(true);
    setPositionId(id);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "live"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="text-sm font-semibold mb-2">Time Left</p>
        <div className="flex space-x-2 text-lg font-mono">
          <div className="bg-gray-200 p-3 rounded-lg">
            {String(timeLeft.days).padStart(2, "0")}
            <span className="text-xs">d</span>
          </div>
          <span className="text-2xl">:</span>
          <div className="bg-gray-200 p-3 rounded-lg">
            {String(timeLeft.hours).padStart(2, "0")}
            <span className="text-xs">h</span>
          </div>
          <span className="text-2xl">:</span>
          <div className="bg-gray-200 p-3 rounded-lg">
            {String(timeLeft.minutes).padStart(2, "0")}
            <span className="text-xs">m</span>
          </div>
          <span className="text-2xl">:</span>
          <div className="bg-gray-200 p-3 rounded-lg">
            {String(timeLeft.seconds).padStart(2, "0")}
            <span className="text-xs">s</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <Button
          className="w-full text-white py-3 rounded-sm 
              bg-blue-500 hover:bg-blue-600
           font-semibold text-lg"
          onClick={handleVoteClick}
        >
          live result
        </Button>
        <Button
          variant={"destructive"}
          className="w-full text-white py-3 rounded-sm font-semibold text-lg"
          onClick={handleVoteClick}
        >
          terminate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminLiveVoteCard;
