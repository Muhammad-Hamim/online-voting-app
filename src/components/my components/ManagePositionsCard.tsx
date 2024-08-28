import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Vote,
  ArrowRight,
  AlertTriangle,
  Play,
  Calendar,
  MoreVerticalIcon,
  Edit,
} from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { ICandidate, IPosition, TPosition } from "@/types/positions";
import CreatorCard from "./CreatorCard";
import MPCandidateCard from "./MPCandidateCard";
import { useState } from "react";
import MPGoLiveDialog from "../dialog/MPGoLiveDialog";
import MPUpdatePositionDialog from "../dialog/MPUpdatePosition";
import MPTerminatePositionDialog from "../dialog/MPTerminatePositionDialog";

const ManagePositionsCard = ({
  position,
}: {
  position: TPosition & IPosition;
}) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isGoLiveDialogOpen, setIsGoLiveDialogOpen] = useState(false);
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);

  const getCandidateCounts = (candidates: ICandidate[]) => {
    const total = candidates.length;
    const approved = candidates?.filter((c) => c.status === "approved").length;
    const rejected = candidates?.filter((c) => c.status === "rejected").length;
    const pending = total - approved - rejected;
    return { total, approved, rejected, pending };
  };
  const candidateCounts = getCandidateCounts(position?.candidates);
  console.log(position)
  return (
    <>
      <Card
        key={position._id}
        className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
      >
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl lg:text-2xl">
              {position.title}
            </CardTitle>
            <Badge
              variant={position?.status === "live" ? "default" : "secondary"}
              className="uppercase"
            >
              {position.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0 bg-transparent hover:bg-transparent outline-none">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-center">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {position.status === "pending" && (
                  <>
                    <DropdownMenuItem
                      onSelect={() => setIsUpdateDialogOpen(true)}
                    >
                      <Button
                        variant="outline"
                        className="w-fit hover:bg-blue-50"
                      >
                        Edit Position <Edit className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIsGoLiveDialogOpen(true)}
                    >
                      <Button
                        variant="default"
                        className="hover:bg-green-600 w-full"
                      >
                        Go Live <Play className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button
                        variant="destructive"
                        className="hover:bg-red-600 w-full"
                      >
                        Delete <AlertTriangle className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}

                {position.status !== "pending" && (
                  <DropdownMenuItem>
                    <Link
                      to={`/admin-dashboard/positions/see-details/${position?._id}`}
                      className="ml-auto"
                    >
                      <Button variant="outline" className="w-full">
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                )}
                {position?.status === "live" && (
                  <DropdownMenuItem
                    onSelect={() => setIsTerminateDialogOpen(true)}
                  >
                    <Button
                      variant="destructive"
                      className="hover:bg-red-600 w-full"
                    >
                      Terminate <AlertTriangle className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="text-gray-200 mt-2">
            {position.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 flex-grow">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              <span>Max: {position.maxCandidates}</span>
            </div>
            <div className="flex items-center text-sm">
              <Vote className="mr-2 h-4 w-4 text-purple-500" />
              <span>Max Votes: {position.maxVotes}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-green-500" />
              <span>
                Created: {moment(position.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-red-500" />
              <span>
                {position.status === "live" ? "Ends" : "Starts"}:
                {moment(
                  position?.status === "live"
                    ? position?.endTime
                    : position?.startTime
                ).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors duration-300">
            <h4 className="font-semibold mb-2 text-sm">Position Creator</h4>
            <CreatorCard creator={position?.creator} />
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid h-fit w-full grid-rows-2 lg:grid-rows-1 grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="all">
                All ({candidateCounts.total})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({candidateCounts.approved})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({candidateCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({candidateCounts.rejected})
              </TabsTrigger>
            </TabsList>
            {["all", "approved", "pending", "rejected"].map(
              (candidateStatus, index) => (
                <TabsContent key={index} value={candidateStatus}>
                  <div className="space-y-2 max-h-64 pb-4 overflow-y-auto">
                    {position?.candidates
                      .filter(
                        (candidate) =>
                          candidateStatus === "all" ||
                          candidate.status === candidateStatus
                      )
                      .map((candidate) => (
                        <MPCandidateCard
                          key={candidate._id}
                          candidate={candidate as ICandidate}
                          positionStatus={position?.status}
                        />
                      ))}
                  </div>
                </TabsContent>
              )
            )}
          </Tabs>
        </CardContent>
      </Card>
      <MPGoLiveDialog
        open={isGoLiveDialogOpen}
        onOpenChange={setIsGoLiveDialogOpen}
        id={position._id}
      />
      <MPUpdatePositionDialog
        position={position}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
      <MPTerminatePositionDialog
        open={isTerminateDialogOpen}
        onOpenChange={setIsTerminateDialogOpen}
        id={position._id}
      />
    </>
  );
};

export default ManagePositionsCard;
