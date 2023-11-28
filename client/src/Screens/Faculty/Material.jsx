import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import apiServer from "../../config/apiServer";

const Material = () => {
  const { fullname } = useSelector((state) => state.userData);
  const [subject, setSubject] = useState();
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    link: "",
    faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setSelected({
          ...selected,
          link: base64String,
        });
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  useEffect(() => {
    toast.loading("Loading Subjects");
     // Create the full URL separately
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

  const addMaterialHandler = () => {
    if (!selected.title || !selected.subject || !selected.link) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.loading("Adding Material");
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/materials`;
    axios
      .post(url, selected, {
        headers: headers,
      })
      .then((response) => {
        console.log(response.data);
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            subject: "",
            link: "",
            faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
          });
        } else {
          console.log(response.data);
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Upload Material`} />
      </div>
      <div className="w-full flex justify-evenly items-center mt-12">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="w-[80%] mt-2">
            <label htmlFor="title">Material Title</label>
            <input
              type="text"
              id="title"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={selected.title}
              onChange={(e) =>
                setSelected({ ...selected, title: e.target.value })
              }
            />
          </div>
          <div className="w-[80%] mt-2">
            <label htmlFor="subject">Material Subject</label>
            <select
              value={selected.subject}
              name="subject"
              id="subject"
              onChange={(e) =>
                setSelected({ ...selected, subject: e.target.value })
              }
              className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full"
            >
              <option defaultValue value="select">
                -- Select Subject --
              </option>
              {subject &&
                subject.map((item) => (
                  <option value={item.name} key={item.name}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          {!selected.link && (
            <label
              htmlFor="upload"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
            >
              Upload Material
              <span className="ml-2">
                <FiUpload />
              </span>
              <input
                type="file"
                name="upload"
                id="upload"
                hidden
                onChange={handleFileChange}
              />
            </label>
          )}
          {selected.link && (
            <p
              className="px-2 border-2 border-blue-500 py-2 rounded text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
              onClick={() => setSelected({ ...selected, link: "" })}
            >
              Remove Selected Material
              <span className="ml-2">
                <AiOutlineClose />
              </span>
            </p>
          )}
          <button
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
            onClick={addMaterialHandler}
          >
            Add Material
          </button>
        </div>
      </div>
    </div>
  );
};

export default Material;
