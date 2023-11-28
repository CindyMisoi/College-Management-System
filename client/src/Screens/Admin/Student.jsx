import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from "../../components/Heading";
import axios from "axios";
import apiServer from "../../config/apiServer";
import { FiSearch, FiUpload } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Student = () => {
  const [selected, setSelected] = useState("view");
  const [branch, setBranch] = useState();
  const [search, setSearch] = useState();
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    enrollment_no: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    semester: "",
    branch: "",
    gender: "",
    profile: "",
    education_level: "",
  });
  const [id, setId] = useState();
  const [students, setStudents] = useState(null);

  // Function to handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result; // Convert the image to base64
        setData({ ...data, profile: base64String });
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const getBranchData = async () => {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // Create the full URL separately
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/branches`;
      const response = await axios.get(url, { headers });

      if (response.data.success) {
        setBranch(response.data.branches);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBranchData();
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      toast.loading("Loading students...");

      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/students`;
      console.log(url);

      const response = await axios.get(url);
      toast.dismiss();

      if (response.data) {
        console.log(response.data);
        setStudents(response.data); // Assuming students are stored in response.data.students
      } else {
        console.error("Couldn't find students");
        toast.error("Couldn't find students");
      }
    } catch (error) {
      toast.dismiss();
      if (error.response) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("An error occurred while fetching students.");
        toast.error("An error occurred while fetching students.");
      }
    }
  };

  const addStudentProfile = async (e) => {
    e.preventDefault();
    toast.loading("Adding Student");
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // Create the full URL separately
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/addStudentDetails`;
      console.log(url);

      const enrollment_no = parseInt(data.enrollment_no, 10);
      const phoneNumber = parseInt(data.phoneNumber, 10);
      const semester = parseInt(data.semester, 10);

      const response = await axios.post(
        url,
        {
          branch: data.branch, // Extract branch from data
          email: data.email, // Extract email from data
          enrollment_no,
          firstName: data.firstName, // Extract firstName from data
          middleName: data.middleName, // Extract middleName from data
          lastName: data.lastName, // Extract lastName from data
          gender: data.gender, // Extract gender from data
          phoneNumber,
          profile: data.profile, // Extract profile from data
          semester,
          education_level: data.education_level, // Extract education_level from data
        },
        {
          headers: headers,
        }
      );

      toast.dismiss();

      if (response.data.success) {
        console.log(response.data.success);
        toast.success(response.data.message);
        const credentialResponse = await axios.post(
          `http://localhost:3000/student_credentials/register`,
          {
            loginid: data.enrollment_no,
            password: "112233",
            enrollment_no: data.enrollment_no,
            email: data.email,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            semester: data.semester,
            branch: data.branch,
            gender: data.gender,
            profile: data.profile,
            education_level: data.education_level,
          },
          console.log(data.branch),
          {
            headers: headers,
          }
        );

        toast.dismiss();

        if (credentialResponse.data.success) {
          toast.success(credentialResponse.data.message);
          setFile("");
          setData({
            enrollment_no: "",
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            semester: "",
            branch: "",
            gender: "",
            profile: "",
            education_level: "",
          });
        } else {
          toast.error(credentialResponse.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const updateStudentProfile = (e) => {
    e.preventDefault();
    toast.loading("Updating Student");
    const headers = {
      "Content-Type": "application/json",
    };
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/students/${id}`;
    console.log(url);
    axios
      .put(url, data, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if ("Updated Student") {
          toast.success(response.data.message);
          setFile("");
          setSearch("");
          setId("");
          setData({
            enrollment_no: "",
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            semester: "",
            branch: "",
            gender: "",
            profile: "",
            education_level: "",
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const searchStudentHandler = (e) => {
    e.preventDefault();
    toast.loading("Getting Student");
    const headers = {
      "Content-Type": "application/json",
    };
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/getStudentDetails`;
    console.log(url);
    axios
      .post(url, { enrollment_no: search }, { headers })
      .then((response) => {
        toast.dismiss();
        console.log(response.data);
        if (response && response.data && response.data.success) {
          if (response.data.student.length === 0) {
            toast.error("No Student Found!");
            setId(""); // Clear the ID when no student is found
          } else {
            toast.success(response.data.message);
            const studentData = response.data.student; // Get the first student
            setData({
              enrollment_no: studentData.enrollment_no,
              firstName: studentData.firstName,
              middleName: studentData.middleName,
              lastName: studentData.lastName,
              email: studentData.email,
              phoneNumber: studentData.phoneNumber,
              semester: studentData.semester,
              branch: studentData.branch,
              gender: studentData.gender,
              profile: studentData.profile,
              education_level: studentData.education_level,
            });
            setId(studentData.id); // Set the ID of the found student
          }
        } else {
          toast.error(
            response && response.data
              ? response.data.message
              : "An error occurred"
          );
          setId(""); // Clear the ID when there's an error
        }
      })
      .catch((error) => {
        toast.error(
          error.response ? error.response.data.message : "An error occurred"
        );
        console.error(error);
        setId(""); // Clear the ID when there's an error
      });
  };
  const deleteStudent = (id) => {
    toast.loading("Deleting student");
    console.log(id);
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/students/${id}`;
    console.log(url);

    axios
      .delete(url)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getStudents();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };


  const setMenuHandler = (type) => {
    setSelected(type);
    setFile("");
    setSearch("");
    setId("");
    setData({
      enrollment_no: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      semester: "",
      branch: "",
      gender: "",
      profile: "",
      education_level: "",
    });
  };
  const educationLevelLabels = {
    1: "Postgraduate",
    2: "Undergraduate",
    3: "Diploma",
    4: "Certificate",
  };

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Student Details" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setMenuHandler("view")}
          >
            View Students
          </button>
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setMenuHandler("add")}
          >
            Add Student
          </button>
          <button
            className={`${
              selected === "edit" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setMenuHandler("edit")}
          >
            Edit Student
          </button>
        </div>
      </div>
      {selected === "view" && (
        <div>
          <button
            className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
            onClick={getStudents}
          >
            Refresh Student List
          </button>
          {students && students.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment No
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Education Level
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                   Course
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-red-500 uppercase tracking-wider">
                   Delete student
                  </th>
                  {/* Add more table headers for other student details */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr
                    key={student.enrollment_no}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.enrollment_no}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {student.firstName} {student.middleName}{" "}
                      {student.lastName}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      +254 {student.phoneNumber}
                    </td>
                    <td
                      className={`px-10 py-4 m-2 whitespace-nowrap  ${
                        student.education_level === "1"
                          ? "bg-red-200"
                          : student.education_level === "2"
                          ? "bg-green-200"
                          : student.education_level === "3"
                          ? "bg-blue-200"
                          : student.education_level === "4"
                          ? "bg-amber-200"
                          : ""
                      } rounded-sm text-gray-700 font-light `}
                    >
                      {educationLevelLabels[student.education_level] ||
                        student.education_level} 
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {student.branch}
                    </td>
                    <td
                      className="px-10 py-4 text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-red-500"
                      onClick={() => deleteStudent(student.id)}
                    >
                      <MdDeleteOutline /> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No students found.</p>
          )}
        </div>
      )}
      {selected === "add" && (
        <form
          onSubmit={addStudentProfile}
          className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
        >
          <div className="w-[40%]">
            <label htmlFor="firstname" className="leading-7 text-sm ">
              Enter First Name
            </label>
            <input
              type="text"
              id="firstname"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="middlename" className="leading-7 text-sm ">
              Enter Middle Name
            </label>
            <input
              type="text"
              id="middlename"
              value={data.middleName}
              onChange={(e) => setData({ ...data, middleName: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="lastname" className="leading-7 text-sm ">
              Enter Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="enrollment_no" className="leading-7 text-sm ">
              Enter Enrollment No
            </label>
            <input
              type="number"
              id="enrollment_no"
              value={data.enrollment_no}
              onChange={(e) =>
                setData({ ...data, enrollment_no: e.target.value })
              }
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="email" className="leading-7 text-sm ">
              Enter Email Address
            </label>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="phoneNumber" className="leading-7 text-sm ">
              Enter Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) =>
                setData({ ...data, phoneNumber: e.target.value })
              }
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="semester" className="leading-7 text-sm ">
              Select Semester
            </label>
            <select
              id="semester"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
              value={data.semester}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
            >
              <option defaultValue>-- Select --</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
              <option value="3">3rd Semester</option>
              <option value="4">4th Semester</option>
              <option value="5">5th Semester</option>
              <option value="6">6th Semester</option>
              <option value="7">7th Semester</option>
              <option value="8">8th Semester</option>
            </select>
          </div>
          <div className="w-[40%]">
            <label htmlFor="branch" className="leading-7 text-sm ">
              Select Branch
            </label>
            <select
              id="branch"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
              value={data.branch}
              onChange={(e) => setData({ ...data, branch: e.target.value })}
            >
              <option defaultValue>-- Select --</option>
              {branch?.map((branch) => {
                return (
                  <option value={branch.name} key={branch.name}>
                    {branch.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="w-[40%]">
            <label htmlFor="gender" className="leading-7 text-sm ">
              Select Gender
            </label>
            <select
              id="gender"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
            >
              <option defaultValue>-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="w-[40%]">
            <label htmlFor="education_level" className="leading-7 text-sm ">
              Select Education Level
            </label>
            <select
              id="education_level"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
              value={data.education_level}
              onChange={(e) =>
                setData({ ...data, education_level: e.target.value })
              }
            >
              <option defaultValue>-- Select --</option>
              <option value="1">Postgraduate</option>
              <option value="2">Undergraduate</option>
              <option value="3">Diploma</option>
              <option value="4">Certificate</option>
            </select>
          </div>
          <div className="w-[40%]">
            <label htmlFor="file" className="leading-7 text-sm">
              Select Profile
            </label>
            <label
              htmlFor="file"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full flex justify-center items-center cursor-pointer"
            >
              Upload
              <span className="ml-2">
                <FiUpload />
              </span>
            </label>
            <input hidden type="file" id="file" onChange={handleFileChange} />
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
            >
              Add New Student
            </button>
          </div>
        </form>
      )}
      {selected === "edit" && (
        <div className="my-6 mx-auto w-full">
          <form
            className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
            onSubmit={searchStudentHandler}
          >
            <input
              type="text"
              className="px-6 py-3 w-full outline-none"
              placeholder="Enrollment No."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="px-4 text-2xl hover:text-blue-500" type="submit">
              <FiSearch />
            </button>
          </form>
          {search && id && (
            <form
              onSubmit={updateStudentProfile}
              className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10"
            >
              <div className="w-[40%]">
                <label htmlFor="firstname" className="leading-7 text-sm ">
                  Enter First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={data.firstName}
                  onChange={(e) =>
                    setData({ ...data, firstName: e.target.value })
                  }
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
                <label htmlFor="middlename" className="leading-7 text-sm ">
                  Enter Middle Name
                </label>
                <input
                  type="text"
                  id="middlename"
                  value={data.middleName}
                  onChange={(e) =>
                    setData({ ...data, middleName: e.target.value })
                  }
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
                <label htmlFor="lastname" className="leading-7 text-sm ">
                  Enter Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={data.lastName}
                  onChange={(e) =>
                    setData({ ...data, lastName: e.target.value })
                  }
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
                <label htmlFor="enrollment_no" className="leading-7 text-sm ">
                  Enrollment No
                </label>
                <input
                  disabled
                  type="number"
                  id="enrollment_no"
                  value={data.enrollment_no}
                  onChange={(e) =>
                    setData({ ...data, enrollment_no: e.target.value })
                  }
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
                <label htmlFor="email" className="leading-7 text-sm ">
                  Enter Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
                <label htmlFor="phoneNumber" className="leading-7 text-sm ">
                  Enter Phone Number
                </label>
                <input
                  type="number"
                  id="phoneNumber"
                  value={data.phoneNumber}
                  onChange={(e) =>
                    setData({ ...data, phoneNumber: e.target.value })
                  }
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
                <label htmlFor="semester" className="leading-7 text-sm ">
                  Semester
                </label>
                <select
                  disabled
                  id="semester"
                  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                  value={data.semester}
                  onChange={(e) =>
                    setData({ ...data, semester: e.target.value })
                  }
                >
                  <option defaultValue>-- Select --</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>
              <div className="w-[40%]">
                <label htmlFor="branch" className="leading-7 text-sm ">
                  Branch
                </label>
                <select
                  disabled
                  id="branch"
                  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                  value={data.branch}
                  onChange={(e) => setData({ ...data, branch: e.target.value })}
                >
                  <option defaultValue>-- Select --</option>
                  {branch?.map((branch) => {
                    return (
                      <option value={branch.name} key={branch.name}>
                        {branch.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="w-[40%]">
                <label htmlFor="gender" className="leading-7 text-sm ">
                  Select Gender
                </label>
                <select
                  id="gender"
                  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                  value={data.gender}
                  onChange={(e) => setData({ ...data, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="w-[40%]">
                <label htmlFor="education_level" className="leading-7 text-sm">
                  Select Education Level
                </label>
                <select
                  id="education_level"
                  className={`px-2 py-3 rounded-sm text-base w-full accent-blue-700 mt-1 ${
                    data.education_level === "1"
                      ? "bg-red-200"
                      : data.education_level === "2"
                      ? "bg-green-200"
                      : data.education_level === "3"
                      ? "bg-blue-200"
                      : data.education_level === "4"
                      ? "bg-amber-200"
                      : "bg-blue-50"
                  }`}
                  value={data.education_level}
                  onChange={(e) =>
                    setData({ ...data, education_level: e.target.value })
                  }
                >
                  <option value="" disabled>
                    -- Select --
                  </option>
                  <option value="1">Postgraduate</option>
                  <option value="2">Undergraduate</option>
                  <option value="3">Diploma</option>
                  <option value="4">Certificate</option>
                </select>
              </div>

              <div className="w-[40%]">
                <label htmlFor="file" className="leading-7 text-sm ">
                  Select New Profile
                </label>
                <label
                  htmlFor="file"
                  className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full flex justify-center items-center cursor-pointer"
                >
                  Upload
                  <span className="ml-2">
                    <FiUpload />
                  </span>
                </label>
                <input
                  hidden
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="w-full flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
                >
                  Update Student
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Student;
