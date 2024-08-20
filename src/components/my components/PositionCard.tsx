import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import moment from "moment";
interface PositionCardProps {
  id: string;
  title: string;
  description: string;
  maxCandidates: number;
  maxVoters: number;
  appliedCandidates: number;
  deadline: string;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogData: React.Dispatch<React.SetStateAction<{ id: string }>>;
}

const PositionCard: React.FC<PositionCardProps> = ({
  id,
  title,
  description,
  maxCandidates,
  maxVoters,
  appliedCandidates,
  deadline,
  setDialogData,
  setIsDialogOpen,
}) => {
  const isDeadlinePassed = moment().isAfter(deadline);

  return (
    <div className="max-w-sm mx-auto my-6 sm:max-w-md xl:max-w-lg">
      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden h-full flex flex-col">
        <CardHeader className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-24">
          <div className="absolute inset-x-4 -bottom-1 bg-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-gray-800">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white flex-grow">
          <CardDescription className="text-gray-700 text-sm sm:text-base mb-4">
            {description}
          </CardDescription>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col items-center justify-center p-4 bg-indigo-100 rounded-lg shadow-md">
              <span className="text-sm font-medium text-gray-600 mt-2">
                Max Candidates
              </span>
              <span className="text-xl font-semibold text-gray-900 mt-1">
                {maxCandidates}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-purple-100 rounded-lg shadow-md">
              <span className="text-sm font-medium text-gray-600 mt-2">
                Max Voters
              </span>
              <span className="text-xl font-semibold text-gray-900 mt-1">
                {maxVoters}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-pink-100 rounded-lg shadow-md">
              <span className="text-sm font-medium text-gray-600 mt-2">
                Applied Candidates
              </span>
              <span className="text-xl font-semibold text-gray-900 mt-1">
                {appliedCandidates}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-indigo-100 rounded-lg shadow-md">
              <span className="text-sm font-medium text-gray-600 mt-2">
                Deadline
              </span>
              <span className="text-sm font-semibold text-gray-900 mt-1">
                {moment(deadline).format("DD MMM YY, hh:mm")}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="">
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              setDialogData({ id });
            }}
            className={`w-full text-white rounded-lg transition-colors duration-300 ${
              isDeadlinePassed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={isDeadlinePassed}
          >
            {isDeadlinePassed ? "Application Closed" : "Apply Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PositionCard;
