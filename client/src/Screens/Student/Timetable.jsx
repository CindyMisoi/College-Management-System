import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import apiServer from "../../config/apiServer";
import { BsFilePdf } from "react-icons/bs";

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const { userData } = useSelector((state) => state);

  useEffect(() => {
    const getTimetable = () => {
      const headers = {
        "Content-Type": "application/json",
      };
      const baseURL = apiServer.defaults.baseURL;
      const url = `${baseURL}/getStudentTimetable`;
      axios
        .post(
          url,
          { semester: userData.semester, branch: userData.branch },
          {
            headers: headers,
            responseType: "arraybuffer", // Set the response type to arraybuffer
          }
        )
        .then((response) => {
          if (response.data) {
            const arrayBuffer = response.data;
            const blob = new Blob([arrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setTimetable(url); // Set the URL to be used as src for iframe or similar.
          }
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(error.response.data.message);
        });
    };
    userData && getTimetable();
  }, [userData, userData.branch, userData.semester]);

// Function to open the PDF in a new tab
const openPDF = () => {
  window.open('http://127.0.0.1:3000/pdf_files/show', '_blank');
};



  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {timetable && (
          <p
            className="flex justify-center items-center text-lg font-medium cursor-pointer hover:text-red-500 hover:scale-110 ease-linear transition-all duration-200 hover:duration-200 hover:ease-linear hover:transition-all"
            onClick={openPDF}
          >
            View
            <span className="ml-2">
              <BsFilePdf />
            </span>
          </p>
        )}
      </div>
      {timetable ? (
        <p>Timetable Available! Click 'View' to open the PDF.</p>
      ) : (
        <p className="mt-10">No Timetable Available At The Moment!</p>
      )}
    </div>
  );
};

export default Timetable;
