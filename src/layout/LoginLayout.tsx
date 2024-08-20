import Footer from "@/shared/Footer";
import Navbar from "@/shared/Navbar";
import { Outlet } from "react-router-dom";

const LoginLayout = () => {
  return (
    <div  className="bg-primaryBg min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LoginLayout;
