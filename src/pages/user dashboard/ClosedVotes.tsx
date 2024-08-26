import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetPositionsWithCandidates } from "@/hooks/usePositions";
import { CirclesWithBar } from "react-loader-spinner";
import ClosedVoteCard from "@/components/my components/ClosedVoteCard";
import { ICandidate } from "@/types/positions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Hash, Mail, Vote } from "lucide-react";

const ClosedVotes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [positionId, setPositionId] = useState<string | null>(null);
  const { closedPositionsWithApprovedCandidates: positions, isLoading } =
    useGetPositionsWithCandidates();

  const candidates = positions?.find(
    (position) => position._id === positionId
  )?.candidates;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const MotionCard = motion(Card);

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent">
          <CirclesWithBar
            height={80}
            width={80}
            color="#4fa94d"
            ariaLabel="Loading positions"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {positions?.map((position) => (
            <ClosedVoteCard
              key={position._id}
              id={position._id}
              title={position.title}
              description={position.description}
              winner={position.winner as ICandidate}
              setIsDialogOpen={setIsDialogOpen}
              setPositionId={setPositionId}
            />
          ))}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
      >
        <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-purple-50 to-indigo-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800 mb-4">
              All Candidates
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates?.map((candidate, index) => (
                <MotionCard
                  key={candidate._id}
                  className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardHeader className="p-4 bg-gradient-to-r from-purple-400 to-indigo-500">
                    <div className="flex justify-between items-center">
                      <Avatar className="w-16 h-16 border-2 border-white">
                        <AvatarImage
                          src={candidate.photo}
                          alt={candidate.name}
                        />
                        <AvatarFallback>
                          {candidate.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Badge
                        className={`${getStatusColor(
                          candidate.status
                        )} text-xs`}
                      >
                        {candidate.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {candidate.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Hash className="w-4 h-4 mr-2" />
                        {candidate.studentId}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Vote className="w-4 h-4 mr-2" />
                        {candidate.votes} votes
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-gray-50">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            ((candidate?.votes as number) / 10) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </CardFooter>
                </MotionCard>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClosedVotes;
