import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ICandidate } from "@/types/positions";

interface ClosedVoteCardProps {
  id: string;
  title: string;
  description: string;
  winner?: ICandidate;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPositionId: React.Dispatch<React.SetStateAction<string>>;
}

const ClosedVoteCard: React.FC<ClosedVoteCardProps> = ({
  id,
  title,
  description,
  winner,
  setIsDialogOpen,
  setPositionId,
}) => {
  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-lg border rounded-lg overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-gray-200 mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-6 relative">
            <h3 className="absolute right-0 bg-black/5 px-3 py-1 rounded-sm text-[12px] font-medium  text-teal-500">
              Winner
            </h3>
            <div className="flex items-center bg-gray-100 p-4 rounded-lg border border-gray-200">
              <img
                src={winner?.photo}
                alt={winner?.name}
                className="w-16 h-16 rounded-full border-4 border-teal-500 mr-4"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {winner?.name}
                </p>
                <p className="text-sm text-gray-600">{winner?.votes} votes</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsDialogOpen(true);
              setPositionId(id); // Assuming you want to set the position ID based on the title
            }}
            className="w-full bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition ease-in-out duration-300"
          >
            View All Candidates
          </button>
        </CardContent>
      </Card>
    </>
  );
};

export default ClosedVoteCard;
