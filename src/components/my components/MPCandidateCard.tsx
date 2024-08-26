import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Check,
  MoreHorizontal,
  User,
  X,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ICandidate } from "@/types/positions";

const MPCandidateCard = ({
  candidate,
  positionStatus,
}: {
  candidate: ICandidate;
  positionStatus: string;
}) => {
  if (!candidate) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 font-medium">No candidate applied</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={candidate.photo} />
          <AvatarFallback>{candidate.name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-lg">{candidate.name}</p>
          <p className="text-sm text-gray-500">{candidate.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Badge
              variant={
                candidate.status === "approved"
                  ? "default"
                  : candidate.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {candidate.status}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Bookmark className="w-3 h-3 mr-1" />
              {candidate.studentId}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {candidate.votes} votes
        </span>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-center">
                Actions
              </DropdownMenuLabel>
              {positionStatus === "pending" && (
                <>
                  <DropdownMenuItem className="cursor-pointer">
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <X className="mr-2 h-4 w-4" /> Reject
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  to={`/admin-dashboard/user-management/user-details/${candidate.email}`}
                >
                  <Button size="sm" variant="ghost">
                    Details <User className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MPCandidateCard;
