import { StateContext } from "@/providers/StateProvider";
import { useContext } from "react";

const useCustomState = () => {
  const context = useContext(StateContext);
  
  if (context === undefined) {
    throw new Error("useCustomState must be used within a StateProvider");
  }

  return context;
};

export default useCustomState;
