import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Notice from "../../components/Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import apiServer from "../../config/apiServer";
import Admin from "./Admin";
import Profile from "./Profile";
import Branch from "./Branch";
import Home from "./Home";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiBookOpen,
  FiMap,
  FiInfo,
  FiBook,
  FiSettings,
} from "react-icons/fi";
import {TbFileReport} from "react-icons/tb";
import jsPDF from 'jspdf';
import "jspdf-autotable";


const AdminMain = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [studentCount, setStudentCount] = useState(null);
    const [facultyCount, setFacultyCount] = useState(null);
    const [adminCount, setAdminCount] = useState(null);
    const [branchCount, setBranchCount] = useState(null);

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  useEffect(() => {
    getStudentCount();
    getFacultyCount();
    getBranchCount();
    getAdminCount();
  }, []);

  const getStudentCount = () => {
    // Make an API request to get the student count
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/studentCount`;
    axios.get(url)
      .then((response) => {
        if (response.data.success) {
          setStudentCount(response.data.count);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the student count:", error);
      });
  };

  const getFacultyCount = () => {
    // Make an API request to get the student count
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/facultyCount`;
    axios.get(url)
      .then((response) => {
        if (response.data.success) {
          setFacultyCount(response.data.count);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the student count:", error);
      });
  };
  const getAdminCount = () => {
    // Make an API request to get the student count
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/facultyCount`;
    axios.get(url)
      .then((response) => {
        if (response.data.success) {
          setAdminCount(response.data.count);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the student count:", error);
      });
  };
  const getBranchCount = () => {
    // Make an API request to get the branch count
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/branchCount`;
    axios.get(url)
      .then((response) => {
        if (response.data.success) {
          setBranchCount(response.data.count);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the student count:", error);
      });
  };


  const generatePDFReport = () => {
    console.log("Generating PDF");
    const doc = new jsPDF();
    // Add content to the PDF document
    doc.text('Admin Report', 10, 10);

     // Define variables to collect the data
  const totalStudents = studentCount;
  const totalFaculty = facultyCount;
  const totalAdmins = adminCount; // Replace with your admin count data
  const totalBranches = branchCount; // Replace with your branch count data
  const gradesOverview = [
    { grade: 'Excellent', percent: 10 },
    { grade: 'Good', percent: 20 },
    { grade: 'Satisfactory', percent: 30 },
    { grade: 'Pass', percent: 30 },
    { grade: 'Fail', percent: 10 },
  ];
  
  
    // Create a data array for the table
  const tableData = [
    ['Category', 'Count'],
    ['Total Students', totalStudents],
    ['Total Faculty', totalFaculty],
    ['Total Admins', totalAdmins],
    ['Total Branches', totalBranches],
    ['Grade Overview'].concat(gradesOverview.map(item => `${item.grade}: ${item.percent}%`)),
  ];
    // Create the table
    doc.autoTable({
      head: [tableData[0]], // Header row
      body: tableData.slice(1), // Data rows
    });
  
    // Save the PDF
    doc.save('admin_report.pdf');
  };
  
  const menuItems = [
    { key: "Dashboard", label: "Dashboard", icon: <FiHome /> },
    { key: "Profile", label: "Profile", icon: <FiUser /> },
    { key: "Student", label: "Student", icon: <FiUsers /> },
    { key: "Faculty", label: "Faculty", icon: <FiBookOpen /> },
    { key: "Admin", label: "Admins", icon: <FiSettings /> },
    { key: "Branch", label: "Branch", icon: <FiMap /> },
    { key: "Subjects", label: "Subjects", icon: <FiBook /> },
    { key: "Notice", label: "Notice", icon: <FiInfo /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-800 text-white text-sm  p-4 rounded-lg ml-4 mt-4 mb-4">
        <h1 className="text-2xl font-semibold mb-6 border-b-2 border-color: rgb(212 212 216) pb-4">
          <p className="ml-12">Admin Panel</p>
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
        <div className='flex px-4 items-center justify-between'>
          <button className='bg-blue-500 rounded-lg rounded-[3px] text-amber-500 flex items-center justify-center p-2 mr-5 mt-4' onClick={generatePDFReport}><TbFileReport/>Generate Report</button>  
            </div>
      </div>

      <div className="w-4/5 p-4 overflow-y-auto">
        <div style={{ marginBottom: "20px" }}>
          <Navbar />
        </div>
        <div className="container">
          {selectedMenu === "Dashboard" && <Home />}
          {selectedMenu === "Branch" && <Branch />}
          {selectedMenu === "Notice" && <Notice />}
          {selectedMenu === "Student" && <Student />}
          {selectedMenu === "Faculty" && <Faculty />}
          {selectedMenu === "Subjects" && <Subjects />}
          {selectedMenu === "Admin" && <Admin />}
          {selectedMenu === "Profile" && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
