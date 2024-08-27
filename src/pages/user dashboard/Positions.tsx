import PositionCard from "@/components/my components/PositionCard";
import { useAllPositions } from "@/hooks/usePositions";
import { IPosition, TPosition } from "@/types/positions";
import { CirclesWithBar } from "react-loader-spinner";

const Positions = () => {
  const {
    pendingPositions: positions,
    isLoading,
    isPending,
    refetch,
  } = useAllPositions("");

  if (isLoading || isPending) {
    return (
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
    );
  }
  return (
    <>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {positions && positions.length > 0 ? (
          positions?.map((position) => (
            <PositionCard
              key={position._id}
              position={position as TPosition & IPosition}
              refetch={refetch}
            />
          ))
        ) : (
          <p>No positions available.</p>
        )}
      </div>
    </>
  );
};

export default Positions;
