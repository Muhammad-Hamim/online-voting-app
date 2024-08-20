import CandidateCard from "@/components/my components/CandidateCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import profileImg from "@/assets/profile/profile.jpg";

const Votes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
   
      <div>
        <Button onClick={() => setIsDialogOpen(true)}>Open modal</Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:min-w-[60vw] max-h-[80vh] flex flex-col">
          <DialogHeader className="border-b border-gray-300 pb-4">
            <DialogTitle>Select a candidate</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar overflow-y-auto max-h-[60vh] flex-grow flex flex-wrap gap-4 justify-center items-center p-4">
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
            <CandidateCard
              name="John Doe"
              photoUrl={profileImg}
              email="john@gmail.com"
              message="I'm John. Please vote for me."
            />
          </div>
          <DialogFooter className="border-t border-gray-300 pt-4">
            <Button type="submit">Submit Vote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Votes;
