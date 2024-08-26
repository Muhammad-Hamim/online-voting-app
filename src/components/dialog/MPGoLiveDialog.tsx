import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { useUpdatePositionStatus } from "@/hooks/usePositions";

type TGolive = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id: string;
};

const MPGoLiveDialog = ({ open, onOpenChange, id }: TGolive) => {
  const { mutation: updateStatusMutation } = useUpdatePositionStatus();
  const handleUpdateStatus = (positionId: string, newStatus: string) => {
    const payload = {
      id: positionId,
      status: newStatus,
    };

    updateStatusMutation.mutate(payload, {});
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Go Live</DialogTitle>
          <DialogDescription>
            Are you sure you want to make this position live?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleUpdateStatus(id, "live")}
            className="w-full mt-4"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MPGoLiveDialog;
