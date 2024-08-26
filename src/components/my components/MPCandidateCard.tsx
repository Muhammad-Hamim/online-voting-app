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
import { Check, MoreHorizontal, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ICandidate } from "@/types/positions";

const MPCandidateCard = ({
  candidate,
  positionStatus,
}: {
  candidate: ICandidate;
  positionStatus: string;
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={candidate.photo} />
          <AvatarFallback>{candidate.name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{candidate.name}</p>
          <p className="text-xs text-gray-500">{candidate.email}</p>
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
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{candidate.votes} votes</span>
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
  );
};

export default MPCandidateCard;
