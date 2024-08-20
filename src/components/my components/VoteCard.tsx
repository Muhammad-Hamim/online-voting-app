import { useState, useEffect } from "react";
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

type Position = {
  id: string;
  title: string;
  description: string;
  duration: string; // Expected format: "2h", "3d", "20m"
  status: string;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Helper function to parse duration string
const parseDuration = (duration: string): number => {
  const value = parseInt(duration);
  if (duration.endsWith("d")) {
    return value * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  } else if (duration.endsWith("h")) {
    return value * 60 * 60 * 1000; // Convert hours to milliseconds
  } else if (duration.endsWith("m")) {
    return value * 60 * 1000; // Convert minutes to milliseconds
  } else {
    throw new Error("Invalid duration format");
  }
};

const calculateTimeLeft = (endTime: number): TimeLeft => {
  const total = endTime - new Date().getTime();

  const daysLeft = Math.floor(total / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutesLeft = Math.floor((total / (1000 * 60)) % 60);
  const secondsLeft = Math.floor((total / 1000) % 60);

  return {
    days: daysLeft,
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  };
};

const VoteCard = ({
  id,
  title,
  description,
  duration,
  status,
  setIsDialogOpen,
}: Position) => {
  const { setPositionId } = useCustomState();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const endTime = new Date().getTime() + parseDuration(duration);

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endTime);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days <= 0 &&
        newTimeLeft.hours <= 0 &&
        newTimeLeft.minutes <= 0 &&
        newTimeLeft.seconds <= 0
      ) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
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
      <CardFooter>
        <Button
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold text-lg"
          onClick={() => {
            setIsDialogOpen(true);
            setPositionId(id);
          }}
        >
          Vote Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoteCard;
