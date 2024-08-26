import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { TUserData } from "@/types/User";

const CreatorCard = ({ creator }: { creator: Partial<TUserData> }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10">
          <AvatarImage src={creator?.photo} alt={creator?.name} />
          <AvatarFallback>{creator.name as string}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">{creator.name}</p>
          <p className="text-gray-500">{creator.email}</p>
        </div>
      </div>
      <Link
        to={`/admin-dashboard/user-management/user-details/${creator.email}`}
      >
        <Button size="sm" variant="ghost" className="hover:bg-gray-200">
          Details <User className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default CreatorCard;
