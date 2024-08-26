import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { IPosition, TPosition } from "@/types/positions";
import { Textarea } from "../ui/textarea";
import moment from "moment";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";
import { useUpdatePositionInfo } from "@/hooks/usePositions";
type TUpdatePosition = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  position: IPosition & TPosition;
};

const MPUpdatePositionDialog = ({
  open,
  onOpenChange,
  position,
}: TUpdatePosition) => {
  const { updatePositionMutation } = useUpdatePositionInfo();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<Partial<TPosition & IPosition>> = (data) => {
    if (position.status !== "pending") {
      return toast.error("You can only update a pending position.");
    }
    console.log(data);
    if (data.startTime) {
      data.startTime = moment(data.startTime).format();
    }
    if (data.endTime) {
      data.endTime = moment(data.endTime).format();
    }
    // Implement position update logic here
    updatePositionMutation.mutate({ id: position._id, payload: data });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>{" "}
      <DialogContent className="md:max-w-[60vw] lg:max-w-[45vw]">
        <DialogHeader>
          <DialogTitle>Update Position</DialogTitle>
          <DialogDescription>
            Update the position details below.
          </DialogDescription>
        </DialogHeader>{" "}
        <form onSubmit={handleSubmit(onSubmit)} className="">
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
                  <Input id="title" {...field} className="col-span-3" />
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
                  name="startTime"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      {...field}
                      defaultValue={moment(position.startTime).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">
                    {errors?.startTime?.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      defaultValue={moment(position.endTime).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      {...field}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">
                    {errors.endTime.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxVotes" className="text-right">
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
                <Label htmlFor="maxCandidate" className="text-right">
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
    </Dialog>
  );
};

export default MPUpdatePositionDialog;
