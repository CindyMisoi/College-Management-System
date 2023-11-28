import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiServer from "../../config/apiServer";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const router = useLocation();
  const nav = useNavigate();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/getFacultyDetails`;
    axios
      .post(
        url,
        { employee_id: router.state.loginid },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setData(response.data.faculty);
          console.log(response.data.faculty);
          dispatch(
            setUserData({
              fullname: `${response.data.faculty.firstName} ${response.data.faculty.middleName} ${response.data.faculty.lastName}`,
              employee_id: response.data.faculty.employee_id,
            })
          );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router.state.loginid, router.state.type]);

  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/faculty/login`;
    axios
      .post(
        url,
        { loginid: router.state.loginid, password: password.current },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const changePasswordHandler = (id) => {
    console.log("this is a new password");
    console.log(data.id);
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/faculties/${data.id}`;
    console.log(url);
    axios
      .patch(
        url,
        { loginid: router.state.loginid, 
          password: password.new
         },
        console.log(router.state.loginid),
        console.log(password.new ),
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("password changed");
          setPassword({ new: "", current: "" });
          nav("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };
  return (
    <div className="w-full mx-auto my-8 flex flex-col md:flex-row justify-center items-center">
      {data && (
        <div className="flex flex-col items-center w-full md:w-2/3 text-center md:text-left md:mr-8">
          <div className="relative">
            <div className="w-full h-48 overflow-hidden rounded-t-full shadow-md">
              <img
                src={data.profile}
                alt="faculty profile"
                className="w-full h-full object-cover object-center rounded-full"
              />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-lg shadow-xl p-6 mt-0 md:mt-4">
            <p className="text-2xl font-semibold mb-4">
              Hello {data.firstName} {data.middleName} {data.lastName} 👋
            </p>
            <div className="text-lg font-normal mb-2">
              <p>Employee Id: {data.employee_id}</p>
              <p>Phone Number: +254 {data.phoneNumber}</p>
              <p>Email Address: {data.email}</p>
              <p>Department: {data.department}</p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              } px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                  onClick={changePasswordHandler}
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;