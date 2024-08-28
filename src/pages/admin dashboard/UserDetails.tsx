"use client";

import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarDays,
  Mail,
  Clock,
  Activity,
  Award,
  IdCard,
  User,
  ArrowRight,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useGetSingleUser } from "@/hooks/useUserInfo";
import { useMyApplications } from "@/hooks/useCandidates";
import { CirclesWithBar } from "react-loader-spinner";
import { useGetSingleUserVotes } from "@/hooks/useVotes";
import { useGetCreatedPositions } from "@/hooks/usePositions";
import { TUserData } from "@/types/User";
import { IPosition, TPosition } from "@/types/positions";
import { IAppliedPositions } from "@/types/candidates";

const UserCard: React.FC<{ user: Partial<TUserData> }> = React.memo(
  ({ user }) => (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-32 h-32 border-4 border-gray-300">
            <AvatarImage src={user?.photo} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left flex-grow">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700"
              >
                <Mail className="w-3 h-3 mr-1" />
                {user?.email}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700"
              >
                <IdCard className="w-3 h-3 mr-1" />
                {user?.studentId}
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs px-2 py-1 capitalize bg-gray-200 text-gray-700"
              >
                <Activity className="w-3 h-3 mr-1" />
                {user?.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Last login: {moment(user?.lastLogin).fromNow()}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {moment(user?.lastLogin).format("DD MMM YYYY, hh:mm:ss A")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      Member since: {moment(user?.createdAt).fromNow()}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {moment(user?.createdAt).format("DD MMM YYYY")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

const StatCard: React.FC<{
  title: string;
  description: string;
  value: number | string;
  icon: React.ReactNode;
}> = React.memo(({ title, description, value, icon }) => (
  <Card className="hover:shadow-md transition-shadow duration-300 bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
        {icon}
        {title}
      </CardTitle>
      <CardDescription className="text-xs text-gray-600">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900">
        {typeof value === "number" ? value : "N/A"}
      </div>
    </CardContent>
  </Card>
));

const VoterCard: React.FC<{ voter: Partial<TUserData> }> = React.memo(
  ({ voter }) => (
    <Card className="w-full hover:shadow-md transition-shadow duration-300 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-gray-300">
            <AvatarImage src={voter.photo} alt={voter.name} />
            <AvatarFallback>{voter.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-800">{voter.name}</h3>
            <p className="text-sm text-gray-600">{voter.email}</p>
            <p className="text-sm text-gray-600">{voter.studentId}</p>
          </div>
          <div className="text-right space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {moment(voter.createdAt).fromNow()}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  {moment(voter.createdAt).format("DD MMM YYYY, hh:mm:ss A")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link
              to={`/admin-dashboard/user-management/user-details/${voter.email}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="text-xs mt-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                voter details <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

const PositionInfoCard: React.FC<{ position: IPosition & TPosition }> =
  React.memo(({ position }) => (
    <Card className="w-full mb-4 overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 relative">
        <div className="absolute top-0 right-0 p-4">
          <Badge
            variant="outline"
            className={`capitalize px-2 py-1 text-xs ${
              position.status === "live"
                ? "bg-green-100 text-green-800"
                : position.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {position.status === "live" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : position.status === "pending" ? (
              <Clock className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {position.status}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {position.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{position.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    Created: {moment(position.createdAt).format("MMM DD, YYYY")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {moment(position.createdAt).format("MMM DD, YYYY, hh:mm:ss A")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center text-gray-700">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>
                    Start: {moment(position.startTime).format("MMM DD, YYYY")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {moment(position.startTime).format("MMM DD, YYYY, hh:mm:ss A")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center text-gray-700">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>
                    End: {moment(position.endTime).format("MMM DD, YYYY")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {moment(position.endTime).format("MMM DD, YYYY, hh:mm:ss A")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">Candidates</p>
              <p className="text-2xl font-bold text-gray-800">
                {position.candidates?.length || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-800">
                {position?.candidates?.reduce(
                  (sum, candidate) => sum + (candidate?.votes || 0),
                  0
                )}
              </p>
            </div>
          </div>
          <Link to={`/admin-dashboard/positions/see-details/${position._id}`}>
            <Button
              variant="outline"
              className="text-gray-800 hover:bg-gray-100"
            >
              Position Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  ));

const AppliedPositionCard: React.FC<{ position: IAppliedPositions }> =
  React.memo(({ position }) => (
    <Card className="overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300 bg-white">
      <PositionInfoCard
        position={position.positionDetails as TPosition & IPosition}
      />
      <CardContent className="p-4">
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm flex items-center text-gray-800">
            <User className="w-4 h-4 mr-2" />
            Position Creator
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={position.creator.photo}
                  alt={position.creator.name}
                />
                <AvatarFallback>
                  {position.creator.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="text-gray-800">{position.creator.name}</p>
                <p className="text-gray-600">{position.creator.email}</p>
              </div>
            </div>
            <Link
              to={`/admin-dashboard/user-management/user-details/${position.creator.email}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                creator details <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-4 text-lg flex items-center text-gray-800">
            <Users className="w-5 h-5 mr-2" />
            Voters
          </h4>
          <div className="space-y-4">
            {position.voters && position.voters.length > 0 ? (
              position.voters.map((voter) => (
                <VoterCard key={voter._id} voter={voter} />
              ))
            ) : (
              <p className="text-gray-600">No voters found</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ));

const CreatedPositionCard: React.FC<{ position: TPosition & IPosition }> =
  React.memo(({ position }) => (
    <Card className="overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300 bg-white">
      <PositionInfoCard position={position} />
      <CardContent className="p-4">
        <div className="mt-4">
          <h4 className="font-semibold mb-4 text-lg flex items-center text-gray-800">
            <Users className="w-5 h-5 mr-2" />
            Candidates
          </h4>
          <div className="space-y-4">
            {position.candidates?.map((candidate) => (
              <Card key={candidate._id} className="w-full bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={candidate.photo}
                          alt={candidate.name}
                        />
                        <AvatarFallback>
                          {candidate.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          {candidate.name}
                        </p>
                        <p className="text-gray-600">{candidate.email}</p>
                        <p className="text-gray-600">{candidate.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-gray-800">
                        {candidate.votes || 0} votes
                      </p>
                      <Link
                        to={`/admin-dashboard/user-management/user-details/${candidate.email}`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          Details <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2 text-sm flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2" />
                      Voters for this candidate
                    </h5>
                    <div className="space-y-2">
                      {candidate.voters && candidate.voters.length > 0 ? (
                        candidate.voters.map((voter) => (
                          <VoterCard key={voter._id} voter={voter} />
                        ))
                      ) : (
                        <p className="text-gray-600">
                          No voters found for this candidate
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  ));

const UserDetails: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const { user, isLoading: isUserLoading } = useGetSingleUser(email as string);
  const { appliedPositions, isLoading: isPositionLoading } = useMyApplications(
    email as string
  );
  const { userVotes: votingActivity } = useGetSingleUserVotes(email as string);
  const { createdPositions, isLoading: isCreatedPositionsLoading } =
    useGetCreatedPositions(email as string);

  const stats = useMemo(() => {
    const totalCreatedPositions =
      createdPositions?.filter((p: TPosition) => p.creator?.email === email)
        ?.length || 0;
    const totalAppliedPositions = appliedPositions?.length || 0;
    const totalVotesReceived =
      appliedPositions?.reduce((sum, pos) => sum + pos.votes, 0) || 0;
    const totalVotesCast = votingActivity?.length || 0;

    return [
      {
        title: "Created Positions",
        description: "Positions created by the user",
        value: totalCreatedPositions,
        icon: <Award className="w-5 h-5" />,
      },
      {
        title: "Applied Positions",
        description: "Positions the user has applied for",
        value: totalAppliedPositions,
        icon: <CheckCircle className="w-5 h-5" />,
      },
      {
        title: "Votes Received",
        description: "Total votes received across all positions",
        value: totalVotesReceived,
        icon: <Users className="w-5 h-5" />,
      },
      {
        title: "Votes Cast",
        description: "Number of votes cast by the user",
        value: totalVotesCast,
        icon: <Activity className="w-5 h-5" />,
      },
    ];
  }, [createdPositions, appliedPositions, votingActivity, email]);

  if (isUserLoading || isPositionLoading || isCreatedPositionsLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <CirclesWithBar
          height="60"
          width="60"
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <UserCard user={user as Partial<TUserData>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Tabs defaultValue="applied" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applied" className="text-sm">
            Applied Positions
          </TabsTrigger>
          <TabsTrigger value="voting" className="text-sm">
            Voting Activity
          </TabsTrigger>
          <TabsTrigger value="created" className="text-sm">
            Created Positions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="applied">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Applied Positions
              </CardTitle>
              <CardDescription className="text-gray-600">
                Positions the user has applied for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {appliedPositions && appliedPositions.length > 0 ? (
                  appliedPositions.map((position) => (
                    <AppliedPositionCard
                      key={position._id}
                      position={position}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No applied positions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="voting">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Voting Activity
              </CardTitle>
              <CardDescription className="text-gray-600">
                Positions the user has voted for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {votingActivity && votingActivity.length > 0 ? (
                  votingActivity.map((vote) => (
                    <Card
                      key={vote._id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
                    >
                      <CardHeader className="bg-gray-100">
                        <CardTitle className="text-xl text-gray-800">
                          {vote.position.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {vote.position.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <p className="text-sm flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Voted: {moment(vote.createdAt).fromNow()}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>
                                {moment(vote.createdAt).format(
                                  "DD MMM YYYY, hh:mm:ss A"
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3 text-lg flex items-center text-gray-800">
                              <User className="w-5 h-5 mr-2" />
                              Voted For
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage
                                    src={vote?.candidate?.candidate?.photo}
                                    alt={vote?.candidate?.candidate?.name}
                                  />
                                  <AvatarFallback>
                                    {vote?.candidate?.candidate?.name?.charAt(
                                      0
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {vote?.candidate?.candidate?.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {vote?.candidate?.candidate?.email}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {vote?.candidate?.candidate?.studentId}
                                  </p>
                                </div>
                              </div>
                              <Link
                                to={`/admin-dashboard/user-management/user-details/${vote?.candidate?.candidate?.email}`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                  Candidate Details{" "}
                                  <User className="w-3 h-3 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Link
                              to={`/admin-dashboard/positions/see-details/${vote.position._id}`}
                            >
                              <Button className="text-sm bg-gray-800 text-white hover:bg-gray-700">
                                Position Details{" "}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-600">No voting activity found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="created">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                Created Positions
              </CardTitle>
              <CardDescription className="text-gray-600">
                Positions created by the user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {createdPositions && createdPositions.length > 0 ? (
                  createdPositions.map((position) => (
                    <CreatedPositionCard
                      key={position._id}
                      position={position as TPosition & IPosition}
                    />
                  ))
                ) : (
                  <p className="text-gray-600">No created positions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetails;
