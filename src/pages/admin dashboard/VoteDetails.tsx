import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useParams } from "react-router-dom";
import { useAllPositions } from "@/hooks/usePositions";
import {
  TooltipContent,
  Tooltip as TooltipSd,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CirclesWithBar } from "react-loader-spinner";
import { TUserData } from "@/types/User";
import { ICandidate } from "@/types/positions";
// Define types for voteData and related data

const VoteDetails: React.FC = () => {
  const { positions, refetch, isLoading } = useAllPositions("");
  const { positionId } = useParams<{ positionId: string }>();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    null
  );

  const position = positions?.find((p) => p._id === positionId);
  const totalVotes =
    position?.candidates.reduce((sum, c) => sum + c.votes, 0) || 0;
  const leadingCandidate = position?.candidates.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );
  useEffect(() => {
    if (position?.status === "live") {
      const interval = setInterval(refetch, 5000);
      return () => clearInterval(interval);
    }
  }, [position?.status, refetch]);

  const pieChartData = position?.candidates.map((c) => ({
    name: c.name,
    value: c.votes,
  }));
  const barChartData = position?.candidates.map((c) => ({
    name: c.name,
    votes: c.votes,
  }));
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  const recentVoters = position?.candidates
    .flatMap((c) =>
      c?.voters?.map((v: Partial<TUserData>) => ({ ...v, votedFor: c.name }))
    )
    .sort(
      (a, b) =>
        new Date(b?.createdAt as string).getTime() -
        new Date(a?.createdAt as string).getTime()
    )
    .slice(0, 5);

  const CreatorCard: React.FC<{ creator: Partial<TUserData> }> = ({
    creator,
  }) => (
    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <h3 className="text-2xl font-bold mb-2">Position Creator</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={creator.photo} alt={creator.name} />
            <AvatarFallback>{creator?.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">{creator.name}</p>
            <p className="text-sm opacity-75">{creator.email}</p>
          </div>
        </div>
        <Link to={`/admin-dashboard/user-management/user-details/${position?._id}`} className="block mt-4">
          <Button variant="secondary" className="w-full">
            See Full Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const CandidateCard: React.FC<{ candidate: Partial<ICandidate> }> = ({
    candidate,
  }) => (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-indigo-200">
            <AvatarImage src={candidate.photo} alt={candidate.name} />
            <AvatarFallback>{candidate?.name}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-indigo-800">
              {candidate.name}
            </h3>
            <p className="text-gray-600">ID: {candidate.studentId}</p>
            <Badge variant="secondary" className="mt-1">
              {(((candidate?.votes as number) / totalVotes) * 100).toFixed(1)}%
              of total
            </Badge>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="flex items-center text-gray-700">
            <Mail className="mr-2 h-4 w-4" /> {candidate.email || "N/A"}
          </p>
          <p className="flex items-center text-gray-700">
            <MessageCircle className="mr-2 h-4 w-4" />{" "}
            {candidate.message || "No message provided"}
          </p>
          <p className="font-bold text-2xl text-indigo-600">
            {candidate.votes} votes
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/admin-dashboard/user-management/user-details/${candidate.email}`}
          >
            <Button variant="outline">See Details</Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() =>
              setExpandedCandidate(
                expandedCandidate === candidate?._id
                  ? null
                  : (candidate?._id as string)
              )
            }
          >
            {expandedCandidate === candidate._id ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </Button>
        </div>
        {expandedCandidate === candidate._id && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-indigo-700">Voters:</h4>
            <ScrollArea className="h-64">
              {candidate?.voters?.map((voter, index) => (
                <VoterCard
                  key={index}
                  voter={{ ...voter, votedFor: candidate?.name as string }}
                />
              ))}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const VoterCard: React.FC<{
    voter: Partial<TUserData> & { votedFor: string };
  }> = ({ voter }) => (
    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors duration-300 mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={voter.photo} alt={voter.name} />
              <AvatarFallback>{voter?.name}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-800">{voter.name}</p>
              <p className="text-xs text-gray-500">ID: {voter.studentId}</p>
              <p className="text-xs text-gray-500">{voter.email}</p>
            </div>
          </div>
          <Badge variant="outline">{voter.votedFor}</Badge>
        </div>
        <TooltipProvider>
          <TooltipSd>
            <TooltipTrigger asChild>
              <p className="text-xs text-gray-400 mt-2">
                {moment(voter.createdAt).fromNow()}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{moment(voter.createdAt).format("DD MMM YYYY, hh:mm:ss A")}</p>
            </TooltipContent>
          </TooltipSd>
        </TooltipProvider>
        <Link
          to={`/admin-dashboard/user-management/user-details/${voter.email}`}
          className="block mt-2"
        >
          <Button variant="outline" size="sm" className="w-full">
            See Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CirclesWithBar
          height="80"
          width="80"
          color="#4fa94d"
          outerCircleColor="#4fa94d"
          innerCircleColor="#4fa94d"
          barColor="#4fa94d"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen rounded-xl">
      <h1 className="text-4xl py-4 font-bold text-center mb-8 text-indigo-800">
        {position?.title} - Vote Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Vote Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">
                Total Votes: {totalVotes}
              </span>
              <Badge variant="secondary" className="text-sm">
                Ends:{" "}
                {moment(position?.endTime).format("MMMM Do YYYY, h:mm:ss a")}
              </Badge>
            </div>
            {position?.candidates?.map((candidate) => (
              <div key={candidate?._id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">
                    {candidate?.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {((candidate.votes / totalVotes) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={(candidate.votes / totalVotes) * 100}
                  className="h-2"
                />
              </div>
            ))}
            {leadingCandidate && (
              <Card className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {position?.status === "live" ? "Current Leader" : "Winner"}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-white">
                      <AvatarImage
                        src={leadingCandidate.photo}
                        alt={leadingCandidate.name}
                      />
                      <AvatarFallback>
                        {leadingCandidate.name}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-2xl font-bold">
                        {leadingCandidate.name}
                      </p>
                      <p className="text-sm opacity-75">
                        ID: {leadingCandidate.studentId}
                      </p>
                      <p className="text-sm opacity-75">
                        Email: {leadingCandidate.email}
                      </p>
                      <p className="text-lg font-semibold mt-2">
                        Votes: {leadingCandidate.votes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {position?.creator && (
            <CreatorCard creator={position.creator as Partial<TUserData>} />
          )}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-indigo-700">
                Vote Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Individual Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Recent Voters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {recentVoters?.map((voter, index) => (
                <VoterCard
                  key={index}
                  voter={voter as Partial<TUserData> & { votedFor: string }}
                />
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-indigo-700">
            More Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="voters">Voters</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {position?.candidates.map((candidate) => (
                  <CandidateCard key={candidate._id} candidate={candidate} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="voters">
              {position?.candidates.map((candidate) => (
                <div key={candidate._id} className="mb-8">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                    {candidate.name}'s Voters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidate?.voters?.map((voter, index) => (
                      <VoterCard
                        key={`${candidate._id}-${index}`}
                        voter={{ ...voter, votedFor: candidate.name }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoteDetails;
