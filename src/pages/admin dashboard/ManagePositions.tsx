import { lazy, Suspense, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAllPositions } from "@/hooks/usePositions";
import { IPosition, TPosition } from "@/types/positions";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import LoadingComponent from "@/utils/LoadingComponent";
const LazyManagePositionsCard = lazy(
  () => import("@/components/my components/ManagePositionsCard")
);
const PositionStats = ({
  positions,
}: {
  positions: TPosition[] & IPosition[];
}) => {
  const getCounts = () => {
    const counts = {
      all: positions?.length,
      live: 0,
      pending: 0,
      terminated: 0,
      closed: 0,
    };
    positions?.forEach((position) => {
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

type TSearchInput = {
  searchTerm: string;
};

const ManagePositions = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const { positions, isLoading, refetch } = useAllPositions(searchTerm);

  const { register, handleSubmit } = useForm<TSearchInput>();

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        refetch().then(() => setIsSearching(false));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      refetch();
      setIsSearching(false);
    }
  }, [searchTerm, refetch]);

  const onSearchSubmit: SubmitHandler<TSearchInput> = (data) => {
    setSearchTerm(data?.searchTerm);
  };
  if (isLoading) {
    return <LoadingComponent />;
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
        <form
          onChange={handleSubmit(onSearchSubmit)}
          className="w-full md:w-1/2"
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search positions..."
              {...register("searchTerm")}
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              type="submit"
              className="absolute inset-y-0 left-0 pl-3 flex items-center"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full h-fit grid-rows-2 grid-cols-3 md:grid-rows-1 md:grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="terminated">Terminated</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : (
          ["all", "live", "pending", "terminated", "closed"].map((status) => (
            <TabsContent key={status} value={status}>
              <div
                key={status}
                className="grid gap-6 md:grid-cols-2 xxl:grid-cols-3"
              >
                {positions
                  ?.filter(
                    (position) => status === "all" || position.status === status
                  )
                  ?.map((position) => {
                    return (
                      <>
                        <Suspense
                          key={position._id}
                          fallback={
                            <div className="h-64 flex items-center justify-center">
                              <Loader2 className="animate-spin" />
                            </div>
                          }
                        >
                          <LazyManagePositionsCard
                            position={position as TPosition & IPosition}
                          />
                        </Suspense>
                      </>
                    );
                  })}
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
};

export default ManagePositions;
