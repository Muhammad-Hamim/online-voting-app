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
      <div className="flex gap-4">
        <Link
          to={"/registration"}
          className="bg-white text-[#1F3D7A] hover:bg-[#2a4e9b] hover:text-white px-4 py-2 rounded-full transition-colors"
        >
          Register
        </Link>
        <Link
          to={"/create-admin"}
          className="text-white bg-[#1f3d7ac0] hover:text-[#2a4e9b] hover:bg-white px-4 py-2 rounded-full transition-colors"
        >
          Admin Account
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
