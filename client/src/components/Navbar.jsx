import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { setAuth, setUserId, setUserData } from "../redux/actions";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  }
  return (
    <div className="shadow-lg shadow-gray-500/40 px-6 py-4 flex justify-between items-center bg-gray-200 rounded-lg">
      <p
        className="font-semibold text-2xl text-slate-900 flex justify-center items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="mr-2">
          <RxDashboard />
        </span>{" "}
        {router.state && router.state.type} Dashboard
      </p>
      <button
        className="flex justify-center items-center text-red-500 px-3 py-2 font-semibold rounded-sm"
        onClick={handleLogout}
      >
        Logout
        <span className="ml-2">
          <FiLogOut />
        </span>
      </button>
    </div>
  );
};

export default Navbar;