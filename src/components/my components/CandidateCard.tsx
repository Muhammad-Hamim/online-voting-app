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
        "min-h-fit p-3 rounded-lg cursor-pointer shadow-lg transition-all duration-200",
        isSelected ? "bg-green-100" : "bg-white"
      )}
      onClick={() => setSelectedCandidate(id)}
    >
      <CardContent className="p-0 flex items-center gap-2">
        <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-800">
            {email}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="p-0 pt-2">
        <p className="text-sm text-gray-700 italic">"{message}"</p>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
