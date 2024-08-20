import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="bg-[#1F3D7A] text-white py-4 px-6 flex justify-between items-center">
      <Link to={"/"}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Voting App</span>
        </div>
      </Link>
      <Link
        to={"/"}
        className="bg-white text-[#1F3D7A] hover:bg-[#2a4e9b] hover:text-white px-4 py-2 rounded-full transition-colors"
      >
        Admin Login
      </Link>
    </header>
  );
};

export default Navbar;
