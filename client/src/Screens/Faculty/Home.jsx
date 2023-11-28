import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Notice from "../../components/Notice";
import Profile from "./Profile";
import Timetable from "./Timetable";
import { Toaster } from "react-hot-toast";
import Material from "./Material";
import Marks from "./Marks";
import Student from "./Student";
import {
  FiInfo,
  FiUser,
  FiUsers,
  FiMap,
  FiBookOpen,
  FiBook,
  FiUpload
} from "react-icons/fi";

const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  const menuItems = [
    { key: "My Profile", label: "Profile", icon: <FiUser /> },
    { key: "Student Information", label: "Student info", icon: <FiUsers /> },
    { key: "Upload Marks", label: "Upload Marks", icon: <FiUpload /> },
    { key: "Timetable", label: "Timetable", icon: <FiMap /> },
    { key: "Material", label: "Material", icon: <FiBook /> },
    { key: "Notice", label: "Notice", icon: <FiInfo /> },
  ];
  return (
    <section>
      {load && (
        <>
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/6 bg-gray-800 text-white text-sm p-4 rounded-lg ml-4 mt-4 mb-4">
              <h1 className="text-2xl font-semibold mb-6 border-b-2 border-color: rgb(212 212 216) pb-4">
                <p className="ml-12">Faculty Menu</p>
              </h1>
              <ul>
                {menuItems.map((item) => (
                  <li
                    key={item.key}
                    className={`menu-item ${
                      selectedMenu === item.key
                        ? "bg-blue-500 rounded-lg"
                        : "hover:bg-gray-700 rounded-lg"
                    }`}
                    onClick={() => setSelectedMenu(item.key)}
                  >
                    <div
                      className={`flex items-center p-4 ${
                        selectedMenu === item.key
                          ? "border-l-4 border-blue-500 rounded-lg"
                          : ""
                      }`}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {item.icon} <span className="ml-2">{item.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content */}
            <div className="w-5/6 p-4 overflow-y-auto">
              <div style={{ marginBottom: "20px" }}>
                <Navbar />
              </div>
              <div className="container">
                {selectedMenu === "My Profile" && <Profile />}
                {selectedMenu === "Student Information" && <Student />}
                {selectedMenu === "Upload Marks" && <Marks />}
                {selectedMenu === "Timetable" && <Timetable />}
                {selectedMenu === "Material" && <Material />}
                {selectedMenu === "Notice" && <Notice />}
              </div>
            </div>
          </div>
        </>
      )}
      <Toaster position="bottom-center" />
    </section>
  );
};

export default Home;
