import { useState, useEffect, ChangeEvent } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Check,
  X,
  Clock,
  Users,
  Vote,
  User,
  ArrowRight,
  AlertTriangle,
  Play,
  Calendar,
} from "lucide-react";
import { useAllPositions, useUpdatePositionStatus } from "@/hooks/usePositions";
import moment from "moment";
import { Link } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { debounce } from "lodash";
import { IPosition, TPosition } from "@/types/positions";
import { TCandidate } from "@/types/candidates";

const PositionStats = ({
  positions,
}: {
  positions: TPosition[] & IPosition[];
}) => {
  const getCounts = () => {
    const counts = {
      all: positions.length,
      live: 0,
      pending: 0,
      terminated: 0,
      closed: 0,
    };
    positions.forEach((position) => {
      counts[position.status]++;
    });
    return counts;
  };

  const counts = getCounts();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {Object.entries(counts).map(([status, count]) => (
        <Card key={status}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)} Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ManagePositions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { positions, isLoading, refetch } = useAllPositions(searchTerm);
  const { mutation: updateStatusMutation } = useUpdatePositionStatus();
  // const [selectedPosition, setSelectedPosition] = useState(null);
  const [terminationMessage, setTerminationMessage] = useState("");
  const [filteredPositions, setFilteredPositions] = useState<
    TPosition[] & IPosition[]
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (positions) {
      setFilteredPositions(positions);
    }
  }, [positions]);

  // Debounce refetch function
  const debouncedRefetch = debounce(() => {
    refetch(); // Assuming refetch is defined and returns a Promise or similar
  }, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedRefetch();
  };

  const onSubmit: SubmitHandler<Partial<TPosition>> = (data) => {
    console.log(data);
    // Implement position update logic here
  };

  const handleUpdateStatus = (positionId: string, newStatus: string) => {
    const payload = {
      id: positionId,
      status: newStatus,
      terminationMessage: terminationMessage,
    };
    if (newStatus === "terminated") {
      payload.terminationMessage = terminationMessage;
    }
    updateStatusMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(`Position ${newStatus} successfully`);
        setTerminationMessage("");
      },
      onError: () => {
        toast.error(`Failed to ${newStatus} position`);
      },
    });
  };

  const getCandidateCounts = (candidates: TCandidate[]) => {
    const total = candidates.length;
    const approved = candidates?.filter((c) => c.status === "approved").length;
    const rejected = candidates?.filter((c) => c.status === "rejected").length;
    const pending = total - approved - rejected;
    return { total, approved, rejected, pending };
  };

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
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-8">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          Manage Positions
        </h1>
        <p className="text-lg opacity-80">
          Oversee and control all position listings across your organization
        </p>
      </div>

      <PositionStats positions={positions as TPosition[] & IPosition[]} />

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search positions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full h-fit grid-rows-2 grid-cols-3 md:grid-rows-1 md:grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="terminated">Terminated</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        {["all", "live", "pending", "terminated", "closed"].map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-6 md:grid-cols-2 xxl:grid-cols-3">
              {filteredPositions
                ?.filter(
                  (position) => status === "all" || position.status === status
                )
                ?.map((position) => {
                  const candidateCounts = getCandidateCounts(
                    position?.candidates as TCandidate[]
                  );
                  return (
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
                            variant={
                              position?.status === "live"
                                ? "default"
                                : "secondary"
                            }
                            className="uppercase"
                          >
                            {position.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-200 mt-2">
                          {position.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-4 flex-grow">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Max: {position.maxCandidate}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Vote className="mr-2 h-4 w-4 text-purple-500" />
                            <span>Max Votes: {position.maxVotes}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-green-500" />
                            <span>
                              Created:{" "}
                              {moment(position.createdAt).format("DD MMM YYYY")}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-red-500" />
                            <span>
                              {position.status === "live" ? "Ends" : "Starts"}:{" "}
                              {moment(
                                position?.status === "live"
                                  ? position?.endTime
                                  : position?.startTime
                              ).format("DD MMM YYYY")}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors duration-300">
                          <h4 className="font-semibold mb-2 text-sm">
                            Position Creator
                          </h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={position?.creator?.photo}
                                  alt={position?.creator?.name}
                                />
                                <AvatarFallback>
                                  {position?.creator.name as string}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p className="font-medium">
                                  {position?.creator.name}
                                </p>
                                <p className="text-gray-500">
                                  {position?.creator.email}
                                </p>
                              </div>
                            </div>
                            <Link
                              to={`/admin-dashboard/user-management/user-details/${position?.creator.email}`}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-gray-200"
                              >
                                Details <User className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
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
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {position?.candidates
                                    .filter(
                                      (candidate) =>
                                        candidateStatus === "all" ||
                                        candidate.status === candidateStatus
                                    )
                                    .map((candidate) => (
                                      <div
                                        key={candidate._id}
                                        className="flex items-center justify-between p-2 bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Avatar className="w-8 h-8">
                                            <AvatarImage
                                              src={candidate.photo}
                                            />
                                            <AvatarFallback>
                                              {candidate.name}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium text-sm">
                                              {candidate.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {candidate.email}
                                            </p>
                                            <Badge
                                              variant={
                                                candidate.status === "approved"
                                                  ? "default"
                                                  : candidate.status ===
                                                    "rejected"
                                                  ? "destructive"
                                                  : "secondary"
                                              }
                                            >
                                              {candidate.status}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm font-medium">
                                            {candidate.votes} votes
                                          </span>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                              >
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuLabel className="text-center">
                                                Actions
                                              </DropdownMenuLabel>
                                              {position.status ===
                                                "pending" && (
                                                <>
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <Check className="mr-2 h-4 w-4" />{" "}
                                                    Approve
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem className="cursor-pointer">
                                                    <X className="mr-2 h-4 w-4" />{" "}
                                                    Reject
                                                  </DropdownMenuItem>
                                                </>
                                              )}
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem>
                                                <Link
                                                  to={`/admin-dashboard/user-management/user-details/${candidate.email}`}
                                                >
                                                  <Button
                                                    size="sm"
                                                    variant="ghost"
                                                  >
                                                    Details{" "}
                                                    <User className="w-4 h-4 ml-2" />
                                                  </Button>
                                                </Link>
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </TabsContent>
                            )
                          )}
                        </Tabs>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        {position.status === "pending" && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-fit hover:bg-blue-50"
                                >
                                  Edit Position
                                </Button>
                              </DialogTrigger>{" "}
                              <DialogContent className="md:max-w-[60vw] lg:max-w-[45vw]">
                                <DialogHeader>
                                  <DialogTitle>Update Position</DialogTitle>
                                  <DialogDescription>
                                    Update the position details below.
                                  </DialogDescription>
                                </DialogHeader>{" "}
                                <form
                                  onSubmit={handleSubmit(onSubmit)}
                                  className=""
                                >
                                  <div className="grid gap-4 py-4 custom-scrollbar max-h-[70vh] overflow-y-auto">
                                    <div className=" space-y-2">
                                      <Label htmlFor="title" className="">
                                        Title
                                      </Label>
                                      <Controller
                                        name="title"
                                        control={control}
                                        defaultValue={position.title}
                                        render={({ field }) => (
                                          <Input
                                            id="title"
                                            {...field}
                                            className="col-span-3"
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="description" className="">
                                        Description
                                      </Label>
                                      <Controller
                                        name="description"
                                        control={control}
                                        defaultValue={position.description}
                                        render={({ field }) => (
                                          <Textarea
                                            id="description"
                                            {...field}
                                            className="col-span-3"
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Controller
                                          name="startDate"
                                          control={control}
                                          rules={{}}
                                          render={({ field }) => (
                                            <Input
                                              type="datetime-local"
                                              {...field}
                                              defaultValue={moment(
                                                position.startTime
                                              ).format("YYYY-MM-DDTHH:mm")}
                                              className="w-full px-3 py-2 border rounded-md"
                                            />
                                          )}
                                        />
                                        {errors.startDate && (
                                          <p className="text-red-500 text-sm">
                                            {
                                              errors?.startDate
                                                ?.message as string
                                            }
                                          </p>
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Controller
                                          name="endDate"
                                          control={control}
                                          rules={{}}
                                          render={({ field }) => (
                                            <Input
                                              type="datetime-local"
                                              defaultValue={moment(
                                                position.endTime
                                              ).format("YYYY-MM-DDTHH:mm")}
                                              {...field}
                                              className="w-full px-3 py-2 border rounded-md"
                                            />
                                          )}
                                        />
                                        {errors.endDate && (
                                          <p className="text-red-500 text-sm">
                                            {errors.endDate.message as string}
                                          </p>
                                        )}
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="maxVotes"
                                          className="text-right"
                                        >
                                          Max Votes
                                        </Label>
                                        <Controller
                                          name="maxVotes"
                                          control={control}
                                          defaultValue={position.maxVotes}
                                          render={({ field }) => (
                                            <Input
                                              id="maxVotes"
                                              type="number"
                                              {...field}
                                              className="col-span-3"
                                            />
                                          )}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="maxCandidate"
                                          className="text-right"
                                        >
                                          Max Candidates
                                        </Label>
                                        <Controller
                                          name="maxCandidate"
                                          control={control}
                                          defaultValue={position.maxCandidate}
                                          render={({ field }) => (
                                            <Input
                                              id="maxCandidate"
                                              type="number"
                                              {...field}
                                              className="col-span-3"
                                            />
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" className="w-full">
                                      Update
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                              <DialogFooter></DialogFooter>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  className="hover:bg-green-600"
                                >
                                  Go Live <Play className="w-4 h-4 ml-2" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Go Live</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to make this position
                                    live?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    onClick={() =>
                                      handleUpdateStatus(position._id, "live")
                                    }
                                    className="w-full mt-4"
                                  >
                                    Confirm
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        {position?.status === "live" && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  className="hover:bg-red-600"
                                >
                                  Terminate{" "}
                                  <AlertTriangle className="w-4 h-4 ml-2" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Terminate Position</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for terminating this
                                    position.
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                  placeholder="Enter termination reason..."
                                  value={terminationMessage}
                                  onChange={(e) =>
                                    setTerminationMessage(e.target.value)
                                  }
                                  className="mt-4"
                                />
                                <DialogFooter>
                                  <Button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        position._id,
                                        "terminated"
                                      )
                                    }
                                    className="w-full mt-4"
                                  >
                                    Confirm Termination
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        {position.status !== "pending" && (
                          <Link
                            to={`/admin-dashboard/positions/see-details/${position?._id}`}
                            className="ml-auto"
                          >
                            <Button variant="outline">
                              View Details{" "}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ManagePositions;
