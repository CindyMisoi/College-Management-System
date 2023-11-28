import React, { useState } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axios from "axios";
import apiServer from "../../config/apiServer";
import { FiSearch } from "react-icons/fi";
const Student = () => {
  const [search, setSearch] = useState();
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

  const searchStudentHandler = (e) => {
    e.preventDefault();
    toast.loading("Getting Student");
    // retrive faculty  department from session storage
    const user = JSON.parse(sessionStorage.getItem("user"));
    const facultyDepartment = user ? user.department : null;
    console.log(facultyDepartment);
    const headers = {
      "Content-Type": "application/json",
    };
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/getStudentDetails`;
    console.log(url);
    axios
      .post(
        url,
        { 
          enrollment_no: search,
          facultyDepartment: facultyDepartment,
         },
        { headers }
      )
      .then((response) => {
        toast.dismiss();
        console.log(response.data);
        if (response && response.data && response.data.success) {
          if (response.data.student.length === 0) {
            toast.error("No Student Found!");
            setId(""); // Clear the ID when no student is found
          } else {
            const studentData = response.data.student; // Get the first student

            // Check if the student is from the same branch as the faculty
            if (studentData.branch === facultyDepartment) {
              toast.success("Student is from this department!");
              setId(studentData.id); // Set the ID of the found student
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
            } else {
              toast.error("Student is not from this department!");
              setId(""); // Clear the ID when student is not from the same department
            }
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
  
  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Student Details" />
      </div>
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
        {id && (
          <div className="mx-auto w-full bg-blue-50 mt-10 flex justify-between items-center p-10 rounded-md shadow-md">
            <div>
              <p className="text-2xl font-semibold">
                {data.firstName} {data.middleName} {data.lastName}
              </p>
              <div className="mt-3">
                <p className="text-lg font-normal mb-2">
                  Enrollment No: {data.enrollment_no}
                </p>
                <p className="text-lg font-normal mb-2">
                  Phone Number: +254 {data.phoneNumber}
                </p>
                <p className="text-lg font-normal mb-2">
                  Email Address: {data.email}
                </p>
                <p className="text-lg font-normal mb-2">
                  Branch: {data.branch}
                </p>
                <p className="text-lg font-normal mb-2">
                  Semester: {data.semester}
                </p>
              </div>
            </div>
            <img
              src={data.profile}
              alt="student profile"
              className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;