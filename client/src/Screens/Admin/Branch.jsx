import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Heading from "../../components/Heading";
import { MdOutlineDelete } from "react-icons/md";
import apiServer from "../../config/apiServer";

const Branch = () => {
  const [data, setData] = useState({
    name: "",
  });
  const [selected, setSelected] = useState("add");
  const [branch, setBranch] = useState();

  useEffect(() => {
    getBranchHandler();
  }, []);

  const getBranchHandler = () => {
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/branches`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const addBranchHandler = () => {
    if (data.name.trim() === "") {
      console.log("Name is empty. Showing error toast.");
      toast.error("Name field cannot be empty.");
      return;
    }

    toast.loading("Adding Branch");
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/addBranch`;

    axios
      .post(url, data, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          console.log(response.data.message);
          toast.success(response.data.message);
          setData({ name: "" });
          getBranchHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const deleteBranchHandler = (id) => {
    const alert = prompt("Are You Sure? Type CONFIRM to continue");
    if (alert === "CONFIRM") {
      toast.loading("Deleting Branch");
      const headers = {
        "Content-Type": "application/json",
      };
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/branches/${id}`;
      axios
        .delete(url, {
          headers: headers,
        })
        .then((response) => {
          toast.dismiss();
          if (response.data.success) {
            toast.success(response.data.message);
            getBranchHandler();
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Add Branch" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Branch
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Branch
          </button>
        </div>
      </div>
      {selected === "add" && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%]">
            <label htmlFor="name" className="leading-7 text-sm ">
              Enter Branch Name
            </label>
            <input
              type="name"
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white"
            onClick={addBranchHandler}
          >
            Add Branch
          </button>
        </div>
      )}
      {selected === "view" && (
        <div className="mt-8 w-full">
          <ul>
            {branch &&
              branch.map((item, index) => (
                <li
                  key={index}
                  className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[70%]"
                >
                  <div>{item.name}</div>
                  <button
                    className="text-2xl hover:text-red-500"
                    onClick={() => deleteBranchHandler(item.id)}
                  >
                    <MdOutlineDelete />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Branch;
