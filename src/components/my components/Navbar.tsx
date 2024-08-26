import useCustomState from "@/hooks/useCustomState";
import { Sling as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";
import {useUserInfo} from "@/hooks/useUserInfo";
const Navbar = () => {
  const { user} = useUserInfo();
  const { isSidebarOpen, setIsSidebarOpen } = useCustomState();
  return (
    <nav className="fixed top-0 z-50 w-full bg-indigo-700 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16 flex items-center">
      <div className="px-3 lg:px-5 lg:pl-3 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden  focus:outline-none"
            >
              <Hamburger
                toggled={isSidebarOpen}
                toggle={setIsSidebarOpen}
                color="white"
              />
            </button>
            <Link to={"#"} className="flex ms-2 md:me-24">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white dark:text-white">
                Online Voting App
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user?.photo}
                    alt="user photo"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
