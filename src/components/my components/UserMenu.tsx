import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, LogOutIcon } from "lucide-react";
import {
  FaVoteYea,
  FaHistory,
  FaUserAltSlash,
  FaFileAlt,
} from "react-icons/fa";
import { GiPodiumWinner } from "react-icons/gi";
import { RiProfileFill } from "react-icons/ri";
import { MdOutlineArchive } from "react-icons/md";
import { GrRadialSelected } from "react-icons/gr";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useUserInfo } from "@/hooks/useUserInfo";
import useCustomState from "@/hooks/useCustomState";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/positions";

interface MenuItem {
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subMenu?: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];
}

const menuItems: Record<string, MenuItem[]> = {
  user: [
    {
      to: "/dashboard",
      icon: RiProfileFill,
      label: "Profile",
    },
    {
      icon: FaVoteYea,
      label: "Votes",
      subMenu: [
        {
          to: "/dashboard/live-votes",
          icon: GrRadialSelected,
          label: "Live votes",
        },
        {
          to: "/dashboard/closed-votes",
          icon: MdOutlineArchive,
          label: "Closed votes",
        },
      ],
    },
    {
      to: "/dashboard/positions",
      icon: GiPodiumWinner,
      label: "Positions",
    },
    {
      to: "/dashboard/my-applications",
      icon: FaFileAlt,
      label: "My Applications",
    },
    {
      to: "/dashboard/voting-history",
      icon: FaHistory,
      label: "Voting History",
    },
  ],
  admin: [
    {
      to: "/admin-dashboard",
      icon: RiProfileFill,
      label: "Profile",
    },

    {
      icon: FaVoteYea,
      label: "Votes",
      subMenu: [
        {
          to: "/admin-dashboard/live-votes",
          icon: GrRadialSelected,
          label: "Live votes",
        },
        {
          to: "/dashboard/closed-votes",
          icon: MdOutlineArchive,
          label: "Closed votes",
        },
      ],
    },
    {
      icon: GiPodiumWinner,
      label: "Positions",
      subMenu: [
        {
          to: "/admin-dashboard/positions/create-position",
          icon: GrRadialSelected,
          label: "Create Position",
        },
        {
          to: "/admin-dashboard/positions/manage-positions",
          icon: GrRadialSelected,
          label: "Manage Positions",
        },
      ],
    },
    {
      icon: FaUserAltSlash,
      label: "user management",
      to: "/admin-dashboard/user-management",
    },
  ],
};

const UserMenu: React.FC = () => {
  const { user } = useUserInfo();
  const { isSidebarOpen } = useCustomState();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await toast.promise(logout(), {
        loading: "Logging out...",
        success: "Logout successful!",
        error: (error: AxiosError<ErrorResponse>) =>
          error.response?.data?.message || "Logout failed!",
      });

      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const currentMenuItems =
    user?.role === "admin" ? menuItems.admin : menuItems.user;

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
          {currentMenuItems.map((item, index) => (
            <MenuItem key={index} {...item} currentPath={location.pathname} />
          ))}
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

interface MenuItemProps extends MenuItem {
  currentPath: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  to,
  icon: Icon,
  label,
  subMenu,
  currentPath,
}) => {
  const isActive =
    to === currentPath ||
    (subMenu && subMenu.some((item) => item.to === currentPath));

  return (
    <li>
      {subMenu ? (
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary
            className={`flex cursor-pointer items-center justify-between rounded-lg p-2 ${
              isActive
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white"
                : "text-gray-900 dark:text-white hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Icon
              className={
                isActive
                  ? "text-indigo-700 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }
            />
            <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <ChevronDown size={20} />
            </span>
          </summary>
          <ul className="mt-2 space-y-1 px-4">
            {subMenu.map((subItem, index) => (
              <SubMenuItem key={index} {...subItem} currentPath={currentPath} />
            ))}
          </ul>
        </details>
      ) : (
        <Link
          to={to || "#"}
          className={`flex items-center w-full p-2 text-sm transition-colors duration-200 rounded-lg ${
            isActive
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white"
              : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          <Icon
            className={`w-5 h-5 mr-2 ${
              isActive
                ? "text-indigo-700 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
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
  currentPath: string;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({
  to,
  icon: Icon,
  label,
  currentPath,
}) => {
  const isActive = to === currentPath;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center w-full p-2 text-sm transition-colors duration-200 rounded-lg pl-11 ${
          isActive
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-white"
            : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        }`}
      >
        <Icon
          className={`w-4 h-4 mr-2 ${
            isActive
              ? "text-indigo-700 dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        />
        {label}
      </Link>
    </li>
  );
};

export default UserMenu;
