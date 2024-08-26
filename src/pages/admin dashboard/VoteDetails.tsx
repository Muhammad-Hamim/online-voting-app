import { useEffect, useState } from "react";
import moment from "moment"; // Import moment
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
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

// Define types for voteData and related data
interface Candidate {
  _id: string;
  name: string;
  photo: string;
  votes: number;
  voters: Voter[];
  studentId: string;
}

interface Voter {
  _id: string;
  name: string;
  photo: string;
  studentId: string;
  createdAt: string;
}

interface Position {
  _id: string;
  title: string;
  description: string;
  status: string;
  endTime: string;
  candidates: Candidate[];
}

const VoteDetails = () => {
  const { positions, refetch, isLoading } = useAllPositions();
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Re-fetch the voting data
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  const { positionId } = useParams<{ positionId: string }>(); // Update to use correct type
  const position = positions?.find(
    (position) => position._id === positionId
  ) as Position; // Cast to Position type
  const totalVotes = position?.candidates.reduce(
    (sum, candidate) => sum + candidate.votes,
    0
  );

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    null
  );

  const leadingCandidate = position?.candidates?.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  const pieChartData = position?.candidates?.map((candidate) => ({
    name: candidate.name,
    value: candidate.votes,
  }));

  const barChartData = position?.candidates?.map((candidate) => ({
    name: candidate?.name,
    votes: candidate?.votes,
  }));

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  const recentVoters = position?.candidates
    .flatMap((candidate) =>
      candidate?.voters.map((voter) => ({
        ...voter,
        votedFor: candidate?.name,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen rounded-xl">
      <h1 className="text-4xl py-4 font-bold text-center mb-8 text-indigo-800">
        {position?.title} - Vote Details
      </h1>

      {isLoading ? (
        <div className="absolute w-fit h-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
      ) : (
        <>
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
                    {moment(position?.endTime).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                    (End Time)
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
                <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                    {position?.status === "live" ? "Current Leader" : "Winner"}
                  </h3>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage
                        src={leadingCandidate?.photo}
                        alt={leadingCandidate?.name}
                      />
                      <AvatarFallback>{leadingCandidate?.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">
                        {leadingCandidate?.name}
                      </p>
                      <p className="font-normal text-sm text-gray-800">
                        {leadingCandidate?.studentId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Votes: {leadingCandidate?.votes}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      {pieChartData?.map((entry, index) => (
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
                    <div
                      key={index}
                      className="flex items-center mb-4 p-2 bg-gray-50 rounded-lg"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={voter.photo} alt={voter.name} />
                        <AvatarFallback>{voter.name}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-800">
                          {voter.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Voted for: {voter.votedFor}
                        </p>
                        <TooltipProvider>
                          <TooltipSd>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-gray-400">
                                {moment(voter.createdAt).fromNow()}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {moment(voter.createdAt).format(
                                  "DD MMM YYYY, hh:mm:ss A"
                                )}
                              </p>
                            </TooltipContent>
                          </TooltipSd>
                        </TooltipProvider>
                      </div>
                    </div>
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
                {position?.candidates.map((candidate) => (
                  <TabsContent
                    key={candidate._id}
                    value="overview"
                    className="mt-4"
                  >
                    <div
                      className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg cursor-pointer"
                      onClick={() =>
                        setExpandedCandidate(
                          expandedCandidate === candidate._id
                            ? null
                            : candidate._id
                        )
                      }
                    >
                      <div className="flex items-center sm:flex-row flex-col">
                        <Avatar className="h-16 w-16 sm:mr-4">
                          <AvatarImage
                            src={candidate.photo}
                            alt={candidate.name}
                          />
                          <AvatarFallback>{candidate.name}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <h3 className="text-xl font-semibold text-indigo-800">
                            {candidate.name}
                          </h3>
                          <p className="text-gray-600">
                            Student ID: {candidate.studentId}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            {((candidate.votes / totalVotes) * 100).toFixed(1)}%
                            of total
                          </Badge>
                        </div>
                      </div>
                      <div className="text-center sm:text-right mt-4 sm:mt-0">
                        <p className="font-bold text-2xl text-indigo-600">
                          {candidate.votes}
                        </p>
                        <p className="text-sm text-gray-500">votes</p>
                      </div>
                      {expandedCandidate === candidate._id ? (
                        <ChevronUp className="text-indigo-600 mt-4 sm:mt-0" />
                      ) : (
                        <ChevronDown className="text-indigo-600 mt-4 sm:mt-0" />
                      )}
                    </div>

                    {expandedCandidate === candidate._id && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2 text-indigo-700">
                          Voters:
                        </h4>
                        <ScrollArea className="h-40">
                          {candidate.voters.map((voter, index) => (
                            <div
                              key={index}
                              className="flex items-center mb-2 p-2 bg-white rounded-lg"
                            >
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage
                                  src={voter.photo}
                                  alt={voter.name}
                                />
                                <AvatarFallback>
                                  {voter.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {voter.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {voter.studentId}
                                </p>

                                <TooltipProvider>
                                  <TooltipSd>
                                    <TooltipTrigger asChild>
                                      <p className="text-xs text-gray-400">
                                        {moment(voter.createdAt).fromNow()}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {moment(voter.createdAt).format(
                                          "DD MMM YYYY, hh:mm:ss A"
                                        )}
                                      </p>
                                    </TooltipContent>
                                  </TooltipSd>
                                </TooltipProvider>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </TabsContent>
                ))}
                {position?.candidates.map((candidate) => (
                  <TabsContent key={candidate._id} value="voters">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                      {candidate.name}'s Voters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {candidate.voters.map((voter, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={voter.photo} alt={voter.name} />
                            <AvatarFallback>
                              {voter.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">
                              {voter.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {voter.studentId}
                            </p>

                            <TooltipProvider>
                              <TooltipSd>
                                <TooltipTrigger asChild>
                                  <p className="text-xs text-gray-400">
                                    {moment(voter.createdAt).fromNow()}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {moment(voter.createdAt).format(
                                      "DD MMM YYYY, hh:mm:ss A"
                                    )}
                                  </p>
                                </TooltipContent>
                              </TooltipSd>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VoteDetails;
