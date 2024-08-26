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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, UserCheck, Calendar } from "lucide-react";
import useCustomState from "@/hooks/useCustomState";
import useTimer from "@/hooks/useTimer";
import { TPosition } from "@/types/positions";
import moment from "moment";

type Position = {
  position: TPosition;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AdminLiveVoteCard({
  position,
  setIsDialogOpen,
}: Position) {
  const { setPositionId } = useCustomState();
  const {
    _id: id,
    title,
    startTime,
    endTime,
    status,
    description,
    maxVotes,
    maxCandidate,
  } = position;
  const { timeLeft } = useTimer(startTime, endTime);

  const handleVoteClick = () => {
    setIsDialogOpen(true);
    setPositionId(id);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1 text-gray-600 dark:text-gray-300">
                {description}
              </CardDescription>
            )}
          </div>
          <Badge
            variant="outline"
            className="text-sm bg-green-100 text-indigo-800 font-medium"
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Time Left
            </p>
            <div className="flex space-x-2 text-lg font-mono">
              {["days", "hours", "minutes", "seconds"].map((unit, index) => (
                <React.Fragment key={unit}>
                  {index > 0 && (
                    <span className="text-2xl text-gray-400">:</span>
                  )}
                  <div className="bg-white dark:bg-gray-600 p-2 rounded-lg shadow">
                    <span className="text-gray-800 dark:text-gray-200">
                      {String(timeLeft[unit as keyof typeof timeLeft]).padStart(
                        2,
                        "0"
                      )}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {unit.charAt(0)}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Start:</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {moment(startTime).format('DD MMM YY')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">End:</span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {moment(endTime).format('DD MMM YY')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                Max Votes:
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {maxVotes}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                Max Candidates:
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {maxCandidate}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 pt-4">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md 
              font-semibold text-lg transition-colors duration-300"
          onClick={handleVoteClick}
        >
          Live Result
        </Button>
        <Button
          variant="destructive"
          className="w-full py-2 rounded-md font-semibold text-lg 
              transition-colors duration-300"
          onClick={handleVoteClick}
        >
          Terminate
        </Button>
      </CardFooter>
    </Card>
  );
}
