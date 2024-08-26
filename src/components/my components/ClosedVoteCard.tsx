import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";
import { ICandidate } from "@/types/positions";

interface ClosedVoteCardProps {
  id: string;
  title: string;
  description: string;
  winner?: ICandidate;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPositionId: React.Dispatch<React.SetStateAction<string | null>>;
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
      <Card className="w-full max-w-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-bl-full opacity-20"></div>
        <CardHeader className="relative z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-purple-800">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {status}
            </Badge>
          </div>
          <CardDescription className="text-purple-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-700">Winner</h3>
                <p className="text-sm text-gray-500">{winner?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-purple-500">
                <AvatarImage src={winner?.photo} alt={winner?.name} />
                <AvatarFallback>{winner?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{winner?.name}</p>
                <p className="text-sm text-gray-500">{winner?.email}</p>
                <p className="text-sm text-gray-500">
                  Student ID: {winner?.studentId}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
          <Button
            variant="secondary"
            className="w-full bg-white text-purple-700 hover:bg-purple-100"
            onClick={() => {
              setIsDialogOpen(true);
              setPositionId(id);
            }}
          >
            <Users className="w-4 h-4 mr-2" />
            View All Candidates
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ClosedVoteCard;
