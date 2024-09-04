import { Loader2 } from "lucide-react";

const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
      </div>
    </div>
  );
};

export default LoadingComponent;
