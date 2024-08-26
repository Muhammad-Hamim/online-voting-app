import PositionCard from "@/components/my components/PositionCard";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAllPositions } from "@/hooks/usePositions";
import { CirclesWithBar } from "react-loader-spinner";
import { ErrorResponse } from "@/types/positions";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useUserInfo } from "@/hooks/useUserInfo";
import { TCandidateApplication } from "@/types/candidates";

const Positions = () => {
  const [axiosSecure] = useAxiosSecure();
  const { user } = useUserInfo();
  const {
    pendingPositions: positions,
    isLoading,
    isPending,
    refetch,
  } = useAllPositions();
  const [dialogData, setDialogData] = useState<{ id: string }>({
    id: "null",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const appliedPosition = positions?.find(
    (position) => position._id === dialogData?.id
  );

  const { register, handleSubmit } = useForm<TCandidateApplication>();
  const applyCandidateMutation = useMutation({
    mutationFn: async (data: TCandidateApplication) => {
      const response = await axiosSecure.post(
        "/candidates/create-candidate",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      refetch();
    },
  });

  const handleApplyCandidate: SubmitHandler<{ message: string }> = (data) => {
    const applicationData: TCandidateApplication = {
      candidate: user?._id as string,
      email: user?.email as string,
      position: appliedPosition?._id as string,
      ...data,
    };
    toast.promise(applyCandidateMutation.mutateAsync(applicationData), {
      loading: "applying...",
      success: "applied successfully!",
      error: (error: AxiosError<ErrorResponse>) =>
        error.response?.data?.message || "Failed to reset password!",
    });
  };

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
          positions?.map((position, index: number) => (
            <PositionCard
              key={index}
              id={position._id as string}
              title={position.title as string}
              description={position.description as string}
              maxCandidates={position.maxCandidate as number}
              maxVoters={position.maxVotes as number}
              appliedCandidates={position?.candidates?.length as number}
              deadline={position.startTime as string}
              setIsDialogOpen={setIsDialogOpen}
              setDialogData={setDialogData}
            />
          ))
        ) : (
          <p>No positions available.</p>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for this position</DialogTitle>
            <DialogDescription>
              Fill up the form and click submit application
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleApplyCandidate)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="name"
                  value={appliedPosition?.title}
                  readOnly
                  className=""
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-right">
                  Describe why people should vote you.
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="write your message"
                  className=""
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Positions;
