import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar, HiOutlineSearch } from "react-icons/hi";
import toast from "react-hot-toast";
import apiServer from "../../config/apiServer";

const Material = () => {
  const [subject, setSubject] = useState([]);
  const [selected, setSelected] = useState();
  const [material, setMaterial] = useState(null); // Initialize as null for a single object

  useEffect(() => {
    toast.loading("Loading Subjects");
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/subjects`;

    axios
      .get(url)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subjects);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  }, []);

  const getSubjectMaterial = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/getSubjectMaterial`;

    axios
      .post(url, { subject: selected }, { headers })
      .then((response) => {
        if (response.data.success) {
          setMaterial(response.data.material); // Set as an object
        } else {
          // Handle the error
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSelectChangeHandler = (e) => {
    setMaterial(null); // Clear the material object when selecting a new subject
    setSelected(e.target.value);
  };

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <Heading title="Material" />
      <div className="mt-8 w-full flex justify-center items-center flex-col">
        <div className="flex justify-center items-center w-[40%]">
          <select
            value={selected}
            name="subject"
            id="subject"
            onChange={onSelectChangeHandler}
            className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700"
          >
            <option defaultValue value="select">
              -- Select Subject --
            </option>
            {subject.map((item) => (
              <option value={item.name} key={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            onClick={getSubjectMaterial}
            className="bg-blue-500 text-white py-3 px-4 text-2xl rounded-sm"
          >
            <HiOutlineSearch />
          </button>
        </div>
        <div className="mt-8 w-full">
          {material && (
            <div className="border-blue-500 border-2 w-full rounded-md shadow-sm py-4 px-6 relative mb-4">
              <p className="text-xl font-medium">
                {material.title}{" "}
                {material.link && (
                  <span className="text-2xl text-blue-500">
                    <IoMdLink />
                  </span>
                )}
              </p>
              <p className="text-base font-normal mt-1">
                {material.subject} - {material.faculty}
              </p>
              <p className="text-sm absolute top-4 right-4 flex justify-center items-center">
                <span className="text-base mr-1">
                  <HiOutlineCalendar />
                </span>{" "}
                {material.createdAt
                  ? `${material.createdAt.split("T")[0].split("-")[2]}/${
                      material.createdAt.split("T")[0].split("-")[1]
                    }/${material.createdAt.split("T")[0].split("-")[0]} ${
                      material.createdAt.split("T")[1].split(".")[0]
                    }`
                  : ""}
              </p>
            </div>
          )}
          {!material && selected && (
            <p className="text-center">No Material For {selected}!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Material;
