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
  CalendarDays,
  Mail,
  Clock,
  Activity,
  Award,
  IdCard,
  User,
  ArrowRight,
} from "lucide-react";
import moment from "moment";
import useTimer from "@/hooks/useTimer";
import { Link, useParams } from "react-router-dom";
import { useGetSingleUser } from "@/hooks/useUserInfo";
import { useMyApplications } from "@/hooks/useCandidates";
import { CirclesWithBar } from "react-loader-spinner";
import { useGetSingleUserVotes } from "@/hooks/useVotes";

const CountdownTimer = ({
  startTime,
  endTime,
  type,
}: {
  startTime: string;
  endTime: string;
  type: string;
}) => {
  const { timeLeft } = useTimer(startTime, endTime);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-semibold mb-2">Ends in</p>
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
    </div>
  );
};

const UserDetails = () => {
  const { email } = useParams<{ email: string }>();
  const { user, isLoading: isUserLoading } = useGetSingleUser(email as string);
  const { appliedPositions, isLoading: isPositionLoading } = useMyApplications(
    email as string
  );
  const { userVotes: votingActivity } = useGetSingleUserVotes(email as string);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {isUserLoading || isPositionLoading ? (
        <div className="flex justify-center items-center py-10">
          <CirclesWithBar
            height="80"
            width="80"
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            ariaLabel="circles-with-bar-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user?.photo} alt={user?.name} />
                  <AvatarFallback>{user?.name}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-3xl font-bold">{user?.name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Badge variant="secondary" className="text-sm">
                      <Mail className="w-3 h-3 mr-1" />
                      {user?.email}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      <IdCard className="w-3 h-3 mr-1" />
                      {user?.studentId}
                    </Badge>
                    <Badge variant="secondary" className="text-sm capitalize">
                      <Activity className="w-3 h-3 mr-1" />
                      {user?.status}
                    </Badge>
                  </div>
                </div>
                <div className="ml-auto space-y-2 text-right hidden md:block">
                  <p className="text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Last login:{" "}
                    {moment(user?.lastLogin).format("DD MMM YYYY, hh:mm:ss A")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 inline mr-1" />
                    Member since:{" "}
                    {moment(user?.createdAt).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applied Positions</CardTitle>
                <CardDescription>
                  Positions the user has applied for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {appliedPositions ? (
                    appliedPositions?.length
                  ) : (
                    <span className="text-lg">not found</span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Votes Received</CardTitle>
                <CardDescription>
                  Total votes received across all positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {appliedPositions ? (
                    appliedPositions?.reduce((sum, pos) => sum + pos.votes, 0)
                  ) : (
                    <span className="text-lg">not found</span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Votes Cast</CardTitle>
                <CardDescription>
                  Number of votes cast by the user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {votingActivity ? (
                    votingActivity?.length
                  ) : (
                    <span className="text-lg">not found</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="applied" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="applied">Applied Positions</TabsTrigger>
              <TabsTrigger value="voting">Voting Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="applied">
              <Card>
                <CardHeader>
                  <CardTitle>Applied Positions</CardTitle>
                  <CardDescription>
                    Positions the user has applied for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {appliedPositions && appliedPositions.length ? (
                      appliedPositions?.map((position) => (
                        <Card key={position._id} className="overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <CardTitle>
                              {position.positionDetails.title}
                            </CardTitle>
                            <CardDescription className="text-gray-100">
                              {position.positionDetails.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                              <Badge
                                variant="outline"
                                className={`capitalize px-3 py-1 text-sm ${
                                  position.positionDetails.status === "live"
                                    ? "bg-green-100 text-green-800"
                                    : position.positionDetails.status ===
                                      "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {position.positionDetails.status}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                <span className="font-semibold">
                                  {position.votes} votes
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <p>
                                <Clock className="w-4 h-4 inline-block mr-2" />{" "}
                                Created:{" "}
                                {moment(
                                  position.positionDetails.createdAt
                                ).format("DD-MM-YY, hh:mm:ss A")}
                              </p>
                              <p>
                                <CalendarDays className="w-4 h-4 inline-block mr-2" />{" "}
                                end:{" "}
                                {moment(
                                  position.positionDetails.endTime
                                ).format("MMM DD YYYY")}
                              </p>
                              {position.positionDetails.status === "live" && (
                                <div className="flex items-center justify-between">
                                  <CountdownTimer
                                    startTime={
                                      position?.positionDetails
                                        ?.startTime as string
                                    }
                                    endTime={
                                      position?.positionDetails
                                        ?.endTime as string
                                    }
                                    type="start"
                                  />
                                  <Link
                                    to={`/admin-dashboard/live-votes/see-details/${position.positionDetails._id}`}
                                  >
                                    <Button size="sm" variant="outline">
                                      Live Details{" "}
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </Link>
                                </div>
                              )}
                              {position.positionDetails.status ===
                                "pending" && (
                                <CountdownTimer
                                  startTime={moment().format()}
                                  endTime={
                                    position?.positionDetails
                                      ?.startTime as string
                                  }
                                  type="end"
                                />
                              )}
                              {position.positionDetails.status === "closed" && (
                                <div className="flex justify-between items-center">
                                  <p>
                                    Closed:{" "}
                                    {moment(
                                      position.positionDetails.endTime
                                    ).format("PPP")}
                                  </p>
                                  <Button size="sm" variant="outline">
                                    View Details{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold mb-2">
                                Position Creator
                              </h4>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage
                                      src={position?.creator.photo}
                                      alt={position?.creator.name}
                                    />
                                    <AvatarFallback>
                                      {position?.creator.name}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p>{position?.creator.name}</p>
                                    <p>{position?.creator.email}</p>
                                  </div>
                                </div>
                                <Link
                                  to={`/admin-dashboard/user-management/user-details/${position?.creator.email}`}
                                >
                                  <Button size="sm" variant="ghost">
                                    See Details{" "}
                                    <User className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="font-semibold mb-2">Voters</h4>
                              <div className="space-y-2">
                                {position.votes &&
                                position.voters.length > 0 ? (
                                  position.voters.map((voter) => (
                                    <div
                                      key={voter._id}
                                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar className="w-14 h-14">
                                          <AvatarImage
                                            src={voter.photo}
                                            alt={voter.name}
                                          />
                                          <AvatarFallback>
                                            {voter?.name}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p>{voter.name}</p>
                                          <p>{voter.email}</p>
                                          <p>{voter.studentId}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                          {moment(voter.createdAt).fromNow()}
                                        </span>
                                        <Link
                                          to={`/admin-dashboard/user-management/user-details/${voter.email}`}
                                        >
                                          <Button size="sm" variant="ghost">
                                            Details{" "}
                                            <User className="w-4 h-4 ml-1" />
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <>
                                    <span>No voters found</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <span className="text-lg">not found</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="voting">
              <Card>
                <CardHeader>
                  <CardTitle>Voting Activity</CardTitle>
                  <CardDescription>
                    Positions the user has voted for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {votingActivity?.map((vote) => (
                      <Card key={vote._id} className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                          <CardTitle>{vote.position.title}</CardTitle>
                          <CardDescription className="text-gray-100">
                            {vote.position.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-2 text-sm mb-4">
                            <p>
                              <Clock className="w-4 h-4 inline-block mr-2" />{" "}
                              Created: {moment(vote.createdAt).fromNow()}
                            </p>
                            <p>
                              <CalendarDays className="w-4 h-4 inline-block mr-2" />{" "}
                              Voted: {moment(vote.createdAt).fromNow()}
                            </p>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">
                              Position Creator
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage
                                    src={vote?.position?.creator?.photo}
                                    alt={vote?.position?.creator?.name}
                                  />
                                  <AvatarFallback>
                                    {vote?.position?.creator?.name}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p>{vote?.position?.creator?.name}</p>
                                  <p>{vote?.position?.creator?.email}</p>
                                </div>
                              </div>
                              <Link
                                to={`/admin-dashboard/user-management/user-details/${vote?.position?.creator?.email}`}
                              >
                                <Button size="sm" variant="ghost">
                                  See Details <User className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className="p-4 bg-gray-50 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">Voted For</h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-14 h-14">
                                  <AvatarImage
                                    src={vote?.candidate?.candidate?.photo}
                                    alt={vote?.candidate?.candidate?.name}
                                  />
                                  <AvatarFallback>
                                    {vote?.candidate?.candidate?.name}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p>{vote?.candidate?.candidate?.name}</p>
                                  <p>{vote?.candidate?.candidate?.email}</p>
                                  <p>{vote?.candidate?.candidate?.studentId}</p>
                                </div>
                              </div>
                              <Link
                                to={`/admin-dashboard/user-management/user-details/${vote?.candidate?.candidate?.email}`}
                              >
                                <Button size="sm" variant="ghost">
                                  Candidate Details{" "}
                                  <User className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button>
                              Position Details{" "}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default UserDetails;
