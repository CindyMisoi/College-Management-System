import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from "../../components/Heading";
import axios from "axios";
import apiServer from "../../config/apiServer";
import { FiSearch, FiUpload } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";


const Faculty = () => {
  const [file, setFile] = useState();
  const [selected, setSelected] = useState("view");
  const [branch, setBranch] = useState();
  const [data, setData] = useState({
    employee_id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    gender: "",
    experience: "",
    post: "",
    profile: "",
  });
  const [id, setId] = useState();
  const [search, setSearch] = useState();
  const [faculties, setFaculties] = useState(null);

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
    getFaculties();
  }, []);

  const getFaculties = async () => {
  try {
    toast.loading("Loading Faculties...");

    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/faculties`;
    console.log(url);

    const response = await axios.get(url);
    toast.dismiss();

    if (response.data) {
      console.log(response.data);
      setFaculties(response.data);
    } else {
      console.error("Couldn't find faculties");
      toast.error("Couldn't find faculties");
    }
  } catch (error) {
    toast.dismiss();
    if (error.response) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("An error occurred while fetching faculties.");
      toast.error("An error occurred while fetching faculties.");
    }
  }
};

  const addFacultyProfile = async (e) => {
    e.preventDefault();
    toast.loading("Adding Student");
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // Create the full URL separately
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/addFacultyDetails`;
      console.log(url);

      const employee_id = parseInt(data.employee_id, 10);
      const phoneNumber = parseInt(data.phoneNumber, 10);
      const experience = parseInt(data.experience, 10);

      const response = await axios.post(
        url,
        {
          department: data.branch, // Extract department from data
          email: data.email, // Extract email from data
          employee_id,
          firstName: data.firstName, // Extract firstName from data
          middleName: data.middleName, // Extract middleName from data
          lastName: data.lastName, // Extract lastName from data
          gender: data.gender, // Extract gender from data
          phoneNumber,
          profile: data.profile, // Extract profile from data
          experience,
          post: data.post,
        },
        {
          headers: headers,
        }
      );

      toast.dismiss();

      if (response.data.success) {
        toast.success(response.data.message);
        const credentialResponse = await axios.post(
          `http://localhost:3000/faculty_credentials/register`,
          {
            loginid: data.employee_id,
            password: "112233",
            employee_id: data.employee_id,
            email: data.email, // Extract email
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            department: data.branch,
            post: data.post,
            gender: data.gender,
            experience: data.experience,
            profile: data.profile,
          },
          {
            headers: headers,
          }
        );

        toast.dismiss();

        if (credentialResponse.data.success) {
          toast.success(credentialResponse.data.message);
          setFile("");
          setData({
            employee_id: "",
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            experience: "",
            branch: "",
            gender: "",
            profile: "",
            post: "",
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

  const updateFacultyProfile = (e) => {
    e.preventDefault();
    toast.loading("Updating Faculty");
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/faculties/${id}`;
    console.log(url);
    axios
      .put(url, { ...data, department: data.branch},{
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setFile();
          setSearch();
          setId();
          setData({
            employee_id: "",
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            branch: "",
            gender: "",
            experience: "",
            post: "",
            profile: "",
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

  const searchFacultyHandler = (e) => {
    e.preventDefault();
    toast.loading("Getting Faculty");
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/getFacultyDetails`;
    console.log(url);
    axios
      .post(url, { employee_id: search }, { headers })
      .then((response) => {
        toast.dismiss();
        if (response && response.data && response.data.success) {
          if (response.data.faculty.length === 0) {
            toast.error("No Faculty Found!");
            setId(""); // Clear the ID when no faculty is found
          } else {
            toast.success(response.data.message);
            const FacultyData = response.data.faculty; // Get the first faculty
            setData({
              employee_id: FacultyData.employee_id,
              firstName: FacultyData.firstName,
              middleName: FacultyData.middleName,
              lastName: FacultyData.lastName,
              email: FacultyData.email,
              phoneNumber: FacultyData.phoneNumber,
              department: FacultyData.department,
              experience: FacultyData.experience,
              gender: FacultyData.gender,
              profile: FacultyData.profile,
              post: FacultyData.post,
            });
            setId(FacultyData.id); // Set the ID of the found faculty
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

  const deleteFaculty = (id) => {
    toast.loading("Deleting faculty");
    console.log(id);
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/faculties/${id}`;
    console.log(url);

    axios
      .delete(url)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getFaculties();
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
      EmployeeNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      department: "",
      experience: "",
      gender: "",
      profile: "",
    });
  };

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Faculty Details" />
        <div className="flex justify-end items-center w-full">
        <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setMenuHandler("view")}
          >
            View Faculty
          </button>
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setMenuHandler("add")}
          >
            Add Faculty
          </button>
          <button
            className={`${
              selected === "edit" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setMenuHandler("edit")}
          >
            Edit Faculty
          </button>
        </div>
      </div>
      {selected === "view" && (
        <div>
          <button
            className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
            onClick={getFaculties}
          >
            Refresh Faculty List
          </button>
          {faculties && faculties.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Employment No
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
                    Post
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-red-500 uppercase tracking-wider">
                    Delete Faculty
                  </th>
                  {/* Add more table headers for other faculty details */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faculties.map((faculty) => (
                  <tr
                    key={faculty.employee_id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {faculty.employee_id}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {faculty.firstName} {faculty.middleName}{" "}
                      {faculty.lastName}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {faculty.email}
                    </td>
                   <td className="px-10 py-4 whitespace-nowrap">
                      +254 {faculty.phoneNumber}
                    </td> 
                    <td className="px-10 py-4 whitespace-nowrap">
                      {faculty.post}
                    </td> 
                    <td className="px-10 py-4 whitespace-nowrap">
                      {faculty.department}
                    </td> 
                    <td
                      className="px-10 py-4 text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-red-500"
                      onClick={() => deleteFaculty(faculty.id)}
                    >
                      <MdDeleteOutline />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No faculties found.</p>
          )}
        </div>
      )}
      {selected === "add" && (
        <form
          onSubmit={addFacultyProfile}
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
            <label htmlFor="employee_id" className="leading-7 text-sm ">
              Enter Employee Id
            </label>
            <input
              type="number"
              id="employee_id"
              value={data.employee_id}
              onChange={(e) =>
                setData({ ...data, employee_id: e.target.value })
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
            <label htmlFor="branch" className="leading-7 text-sm ">
              Select Department
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
            <label htmlFor="post" className="leading-7 text-sm ">
              Enter POST
            </label>
            <input
              type="text"
              id="post"
              value={data.post}
              onChange={(e) => setData({ ...data, post: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[95%] flex justify-evenly items-center">
            <div className="w-[25%]">
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
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="w-[25%]">
              <label htmlFor="experience" className="leading-7 text-sm ">
                Enter Experience
              </label>
              <input
                type="number"
                id="experience"
                value={data.experience}
                onChange={(e) =>
                  setData({ ...data, experience: e.target.value })
                }
                className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="w-[25%]">
              <label htmlFor="file" className="leading-7 text-sm ">
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
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-6 py-3 rounded-sm my-6 text-white"
          >
            Add New Faculty
          </button>
        </form>
      )}
      {selected === "edit" && (
        <div className="my-6 mx-auto w-full">
          <form
            className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
            onSubmit={searchFacultyHandler}
          >
            <input
              type="text"
              className="px-6 py-3 w-full outline-none"
              placeholder="Employee Id."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="px-4 text-2xl hover:text-blue-500">
              <FiSearch />
            </button>
          </form>
          {search && id && (
            <form
              onSubmit={updateFacultyProfile}
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
                <label htmlFor="employee_id" className="leading-7 text-sm ">
                  Employee No
                </label>
                <input
                  disabled
                  type="number"
                  id="employee_id"
                  value={data.employee_id}
                  onChange={(e) =>
                    setData({ ...data, employee_id: e.target.value })
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
                <label htmlFor="post" className="leading-7 text-sm ">
                  POST
                </label>
                <input
                  type="text"
                  id="post"
                  value={data.post}
                  onChange={(e) => setData({ ...data, post: e.target.value })}
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>

              <div className="w-[40%]">
                <label htmlFor="experience" className="leading-7 text-sm ">
                  Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  value={data.experience}
                  onChange={(e) =>
                    setData({ ...data, experience: e.target.value })
                  }
                  className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="w-[40%]">
            <label htmlFor="branch" className="leading-7 text-sm ">
              Select Department
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
              <button
                type="submit"
                className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
              >
                Update Faculty
              </button>
            </form>
          )}
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};
export default Faculty;
