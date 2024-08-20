import Navbar from "@/components/my components/Navbar";
import UserMenu from "@/components/my components/UserMenu";
import { Outlet } from "react-router-dom";

const UserDashboardLayout = () => {
  return (
    <>
      <Navbar />
      <UserMenu />
      <main className="p-4 lg:ml-64 mt-[64px] min-h-[calc(100vh-64px)] overflow-y-auto bg-primaryBg flex justify-center items-center">
        <Outlet />
      </main>
    </>
  );
};

export default UserDashboardLayout;
