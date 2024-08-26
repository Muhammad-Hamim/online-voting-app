import { useState, ChangeEvent } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";

import { useAllPositions } from "@/hooks/usePositions";

import { CirclesWithBar } from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";
import { debounce } from "lodash";
import { IPosition, TPosition } from "@/types/positions";

import ManagePositionsCard from "@/components/my components/ManagePositionsCard";
import MPTerminatePositionDialog from "@/components/dialog/MPTerminatePositionDialog";

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

  // Debounce refetch function
  const debouncedRefetch = debounce(() => {
    refetch(); // Assuming refetch is defined and returns a Promise or similar
  }, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedRefetch();
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
              {positions
                ?.filter(
                  (position) => status === "all" || position.status === status
                )
                ?.map((position) => {
                  return (
                    <>
                      <ManagePositionsCard
                        key={position._id}
                        position={position as TPosition & IPosition}
                      />
                    </>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <MPTerminatePositionDialog />
    </div>
  );
};

export default ManagePositions;
