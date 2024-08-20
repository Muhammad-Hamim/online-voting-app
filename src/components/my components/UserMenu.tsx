/* eslint-disable @typescript-eslint/no-explicit-any */
import useCustomState from "@/hooks/useCustomState";
import { ChevronDown, LogOutIcon } from "lucide-react";
import { FaVoteYea, FaHistory } from "react-icons/fa";
import { GiPodiumWinner } from "react-icons/gi";
import { RiProfileFill } from "react-icons/ri";
import { MdOutlineArchive } from "react-icons/md";
import { GrRadialSelected } from "react-icons/gr";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const UserMenu = () => {
  const { isSidebarOpen } = useCustomState();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await toast.promise(logout(), {
        loading: "Logging out...",
        success: "Logout successful!",
        error: (error: any) =>
          error.response?.data?.message || "Logout failed!",
      });

      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
        isSidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"
      } bg-white border-r-2 border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700 `}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <MenuItem to="/dashboard" icon={RiProfileFill} label="Profile" />
          <MenuItem icon={FaVoteYea} label="Votes">
            <SubMenuItem
              to="/dashboard/live-votes"
              icon={GrRadialSelected}
              label="Live votes"
            />
            <SubMenuItem
              to="/dashboard/closed-votes"
              icon={MdOutlineArchive}
              label="Closed votes"
            />
          </MenuItem>
          <MenuItem to="positions" icon={GiPodiumWinner} label="Positions" />
          <MenuItem
            to="voting-history"
            icon={FaHistory}
            label="Voting History"
          />
        </ul>
      </div>
      <div className="sticky inset-x-0 bottom-2 px-3 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-2 py-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <LogOutIcon />
          <span className="ms-3 whitespace-nowrap">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserMenu;

interface MenuItemProps {
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  icon: Icon,
  label,
  children,
}) => {
  return (
    <li>
      {children ? (
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-gray-900 dark:text-white hover:bg-gray-100 hover:text-gray-700">
            <Icon className="text-gray-900" />
            <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <ChevronDown size={20} />
            </span>
          </summary>
          <ul className="mt-2 space-y-1 px-4">{children}</ul>
        </details>
      ) : (
        <Link
          to={to || "#"}
          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        >
          <Icon className="text-gray-900" />
          <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
        </Link>
      )}
    </li>
  );
};

interface SubMenuItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <li>
      <Link
        to={to}
        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 flex items-center gap-2 hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon className="text-gray-900" />
        {label}
      </Link>
    </li>
  );
};
