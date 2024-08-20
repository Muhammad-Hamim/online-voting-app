import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the type for the context value
interface StateContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
  positionId: string | null;
  setPositionId: Dispatch<SetStateAction<string | null>>;
}

// Create the context with the defined type
export const StateContext = createContext<StateContextType | undefined>(
  undefined
);

interface StateProviderProps {
  children: ReactNode;
}

const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };
  const [positionId, setPositionId] = useState<string | null>(null);
  return (
    <StateContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        positionId,
        setPositionId,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
