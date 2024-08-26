/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useUserInfo } from "@/hooks/useUserInfo";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";

interface IPosition {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  maxCandidates: number;
  maxVotes: number;
  creator: string;
}

const CreatePosition = () => {
  const [axiosSecure] = useAxiosSecure();
  const { user } = useUserInfo();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    getValues,
  } = useForm<IPosition>();

  const createPositionMutation = useMutation({
    mutationFn: async (data: IPosition) => {
      const response = await axiosSecure.post(
        "/positions/create-position",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      resetForm();
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast.error(err?.response?.data?.message as string);
    },
  });

  const onSubmit: SubmitHandler<IPosition> = (data) => {
    const formattedData = {
      ...data,
      maxCandidates: Number(data.maxCandidates),
      maxVotes: Number(data.maxVotes),
      startTime: moment(data.startTime).format(),
      endTime: moment(data.endTime).format(),
      creator: user?._id as string,
    };
    toast.promise(createPositionMutation.mutateAsync(formattedData), {
      loading: "Creating position...",
      success: "Position created successfully!",
      error: (error: Error) => error.message,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">Position Details</CardTitle>
          <CardDescription className="text-purple-100">
            Set up a new voting position for candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Position Title</Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter position title" />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">
                  {errors.title.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Textarea {...field} placeholder="Describe the position" />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message as string}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label>Start Date and Time</Label>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{
                    required: "Start date is required",
                    validate: {
                      afterEndDate: (value) => {
                        const { endTime } = getValues();
                        return (
                          moment(value).isBefore(moment(endTime)) ||
                          "Start date must be before end date"
                        );
                      },
                      beforeCurrentDate: (value) => {
                        return (
                          moment(value).isBefore(moment(new Date())) ||
                          "Start date must be after current date"
                        );
                      },
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        {...field}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  )}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">
                    {errors.startTime.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label>End Date and Time</Label>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{
                    required: "End date is required",
                    validate: {
                      beforeStartDate: (value) => {
                        const { startTime } = getValues();
                        return (
                          moment(value).isAfter(moment(startTime)) ||
                          "End date must be after start date"
                        );
                      },
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        {...field}
                        className="w-full px-3 py-2 border rounded-md pr-10"
                      />
                    </div>
                  )}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">
                    {errors.endTime.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxVotes">Maximum Votes</Label>
                <Controller
                  name="maxVotes"
                  control={control}
                  rules={{ required: "Max votes is required", min: 1 }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter max votes"
                    />
                  )}
                />
                {errors.maxVotes && (
                  <p className="text-red-500 text-sm">
                    {errors.maxVotes.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCandidates">Maximum Candidates</Label>
                <Controller
                  name="maxCandidates"
                  control={control}
                  rules={{ required: "Max candidates is required", min: 1 }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter max candidates"
                    />
                  )}
                />
                {errors.maxCandidates && (
                  <p className="text-red-500 text-sm">
                    {errors.maxCandidates.message as string}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition duration-300"
            onClick={handleSubmit(onSubmit)}
          >
            Create Position
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default CreatePosition;
