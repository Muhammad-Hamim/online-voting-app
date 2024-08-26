import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useUpdatePositionStatus } from "@/hooks/usePositions";
import toast from "react-hot-toast";
import { useState } from "react";
import useCustomState from "@/hooks/useCustomState";
const MPTerminatePositionDialog = () => {
  const { mutation: updateStatusMutation } = useUpdatePositionStatus();
  const { mpPositionId, setMpPositionId } = useCustomState();
  const [terminationMessage, setTerminationMessage] = useState<string>("");
  const handleUpdateStatus = (positionId: string, newStatus: string) => {
    const payload = {
      id: positionId,
      status: newStatus,
      terminationMessage: newStatus === "terminated" ? terminationMessage : "",
    };
    console.log(payload);

    updateStatusMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(`Position ${newStatus} successfully`);
        setTerminationMessage("");
        setMpPositionId(false);
      },
      onError: () => {
        toast.error(`Failed to ${newStatus} position`);
      },
    });
  };
  return (
    <Dialog open={mpPositionId as boolean} onOpenChange={setMpPositionId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminate Position</DialogTitle>
          <DialogDescription>
            Please provide a reason for terminating this position.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Enter termination reason..."
          value={terminationMessage}
          onChange={(e) => setTerminationMessage(e.target.value)}
          className="mt-4"
        />
        <DialogFooter>
          <Button
            onClick={() =>
              handleUpdateStatus(mpPositionId as string, "terminated")
            }
            className="w-full mt-4"
          >
            Confirm Termination
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MPTerminatePositionDialog;
