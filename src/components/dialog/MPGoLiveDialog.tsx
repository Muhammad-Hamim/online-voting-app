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
const MPGoLiveDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Go Live</DialogTitle>
          <DialogDescription>
            Are you sure you want to make this position live?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => handleUpdateStatus(position._id, "live")}
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
