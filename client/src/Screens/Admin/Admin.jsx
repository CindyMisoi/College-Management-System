import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from "../../components/Heading";
import axios from "axios";
import apiServer from "../../config/apiServer";
import { FiSearch, FiUpload } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Admin = () => {
  const [selected, setSelected] = useState("view");
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    employee_id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    profile: "", 
  });
  const [id, setId] = useState();
  const [search, setSearch] = useState();
  const [admins, setAdmins] = useState();

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
  useEffect(()=> {
    getAdmins();
  }, [])
  const getAdmins = async () => {
    try {
      toast.loading("Loading Admins...");
  
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/admins`;
      console.log(url);
  
      const response = await axios.get(url);
      toast.dismiss();
  
      if (response.data) {
        console.log(response.data);
        setAdmins(response.data);
      } else {
        console.error("Couldn't find admins");
        toast.error("Couldn't find admins");
      }
    } catch (error) {
      toast.dismiss();
      if (error.response) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("An error occurred while fetching admins.");
        toast.error("An error occurred while fetching admins.");
      }
    }
  };
  const addAdminProfile = async (e) => {
    e.preventDefault();
    toast.loading("Adding Admin");
    const headers = {
      "Content-Type": "application/json",
    };
  
    try {
      // Create the full URL separately
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/addAdminDetails`;
      console.log(url);
  
      const employee_id = parseInt(data.employee_id, 10);
      const phoneNumber = parseInt(data.phoneNumber, 10);
  
      const response = await axios.post(
        url,
        {
          email: data.email,      // Extract email from data
          employee_id,
          firstName: data.firstName,  // Extract firstName from data
          middleName: data.middleName,  // Extract middleName from data
          lastName: data.lastName,      // Extract lastName from data
          gender: data.gender,          // Extract gender from data
          phoneNumber,
          profile: data.profile,        // Extract profile from data
          
        },
        {
          headers: headers,
        }
      );
  
      toast.dismiss();
  
      if (response.data.success) {
        toast.success(response.data.message);
        const credentialResponse = await axios.post(
          `http://localhost:3000/admin_credentials/register`,
          { 
             loginid: data.employee_id,
             password: "112233",
             employee_id: data.employee_id,
             email: data.email,
             firstName: data.firstName,
             middleName: data.middleName,
             lastName: data.lastName,
             profile: data.profile,
             gender: data.gender,
             phoneNumber: data.phoneNumber,
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
            gender: "",
            profile: "",
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
  
  const updateAdminProfile = (e) => {
    e.preventDefault();
    toast.loading("Updating Admin");
    const headers = {
      "Content-Type": "application/json",
    };
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/admins/${id}`;
    console.log(url);
    axios
      .put(url, data, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setFile("");
          setSearch("");
          setId("");
          setData({
            employee_id: "",
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: "",
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


  const searchAdminHandler = (e) => {
    e.preventDefault();
    toast.loading("Getting Admin");
    const headers = {
      "Content-Type": "application/json",
    };
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/getAdminDetails`;
    console.log(url);
    axios
      .post(
        url,
        { employee_id: search },
        { headers }
      )
      .then((response) => {
        toast.dismiss();
        console.log(response.data);
        if (response && response.data && response.data.success) {
          if (response.data.admin.length === 0) {
            toast.error("No Admin Found!");
            setId(""); // Clear the ID when no Admin is found
          } else {
            toast.success(response.data.message);
            const AdminData = response.data.admin; // Get the first Admin
            setData({
              employee_id: AdminData.employee_id,
              firstName: AdminData.firstName,
              middleName: AdminData.middleName,
              lastName: AdminData.lastName,
              email: AdminData.email,
              phoneNumber: AdminData.phoneNumber,
              gender: AdminData.gender,
              profile: AdminData.profile,
            });
            setId(AdminData.id); // Set the ID of the found Admin
          }
        } else {
          toast.error(response && response.data ? response.data.message : "An error occurred");
          setId(""); // Clear the ID when there's an error
        }
      })
      .catch((error) => {
        toast.error(error.response ? error.response.data.message : "An error occurred");
        console.error(error);
        setId(""); // Clear the ID when there's an error
      });
  };
  
  const deleteAdmin = (id) => {
    toast.loading("Deleting admin");
    console.log(id);
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/admins/${id}`;
    console.log(url);

    axios
      .delete(url)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getAdmins();
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
      employee_id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      profile: "",
    });
  };

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Admin Details" />
        <div className="flex justify-end items-center w-full">
        <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setMenuHandler("view")}
          >
            View Admins
          </button>
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setMenuHandler("add")}
          >
            Add Admin
          </button>
          <button
            className={`${
              selected === "edit" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setMenuHandler("edit")}
          >
            Edit Admin
          </button>
        </div>
      </div>
      {selected === "view" && (
        <div>
          <button
            className="bg-blue-500 px-6 py-3 rounded-sm mb-6 text-white"
            onClick={getAdmins}
          >
            Refresh Admin List
          </button>
          {admins && admins.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                  <th className="px-10 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-red-500 uppercase tracking-wider">
                    Delete Admin
                  </th>

                  {/* Add more table headers for other admin details */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr
                    key={admin.employee_id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-10 py-4 whitespace-nowrap">
                      {admin.employee_id}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {admin.firstName} {admin.middleName}{" "}
                      {admin.lastName}
                    </td>
                    <td className="px-10 py-4 whitespace-nowrap">
                      {admin.email}
                    </td>
                   <td className="px-10 py-4 whitespace-nowrap">
                      +254 {admin.phoneNumber}
                    </td> 
                    <td
                      className="px-10 py-4 text-2xl group-hover:text-blue-500 ml-2 cursor-pointer hover:text-red-500"
                      onClick={() => deleteAdmin(admin.id)}
                    >
                      <MdDeleteOutline />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No admins found.</p>
          )}
        </div>
      )}
      {selected === "add" && (
        <form
          onSubmit={addAdminProfile}
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
              onChange={(e) => setData({ ...data, employee_id: e.target.value })}
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
            <label htmlFor="gender" className="leading-7 text-sm ">
              Select Gender
            </label>
            <select
              id="gender"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
            >
              {" "}
              <option defaultValue>-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="w-[40%]">
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
            <input
              hidden
              type="file"
              id="file"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-6 py-3 rounded-sm my-6 text-white"
          >
            Add New Admin
          </button>
        </form>
      )}
      {selected === "edit" && (
        <div className="my-6 mx-auto w-full">
          <form
            onSubmit={searchAdminHandler}
            className="flex justify-center items-center border-2 border-blue-500 rounded w-[40%] mx-auto"
          >
            <input
              type="text"
              className="px-6 py-3 w-full outline-none"
              placeholder="Employee Id."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="px-4 text-2xl hover:text-blue-500" type="submit">
              <FiSearch />
            </button>
          </form>
          {search && id && (
            <form
              onSubmit={updateAdminProfile}
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
                Update Admin
              </button>
            </form>
          )}
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Admin;