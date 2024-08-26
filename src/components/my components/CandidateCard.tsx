import { FC } from "react";
import clsx from "clsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

interface CandidateCardProps {
  id: string;
  photoUrl: string;
  name: string;
  email: string;
  message?: string;
  selectedCandidate: string | null;
  setSelectedCandidate: React.Dispatch<React.SetStateAction<string | null>>;
}

const CandidateCard: FC<CandidateCardProps> = ({
  id,
  photoUrl,
  name,
  email,
  message,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  const isSelected = selectedCandidate === id;
  return (
    <Card
      className={clsx(
        "min-h-fit p-4 rounded-lg cursor-pointer shadow-lg transition-all duration-200",
        isSelected
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          : "bg-white text-gray-900 relative"
      )}
      onClick={() => setSelectedCandidate(id)}
    >
      {!isSelected && (
        <div className="absolute top-0 left-0 bg-gradient-to-r to-indigo-500 from-purple-500 h-2 w-full rounded-t-xl"></div>
      )}
      <CardContent className="p-0 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <CardDescription
            className={`${isSelected ? "text-white" : ""}"text-sm"`}
          >
            {email}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="p-0 pt-2">
        <p
          className={clsx(
            "text-sm italic",
            isSelected ? "text-white" : "text-gray-700"
          )}
        >
          "{message}"
        </p>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
