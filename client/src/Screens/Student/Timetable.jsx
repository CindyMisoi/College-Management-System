import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import apiServer from "../../config/apiServer";
import { BsFilePdf } from "react-icons/bs";

const Timetable = () => {
  const { userData } = useSelector((state) => state);
  const [timetable, setTimetable] = useState(null);

  // Function to open the PDF in a new tab
  const openPDF = () => {
    // Replace the URL with the actual URL for the timetable PDF
    window.open('http://127.0.0.1:3000/pdf_files/show', '_blank');
  };

  useEffect(() => {
    const getTimetable = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };
        const baseURL = apiServer.defaults.baseURL;
        const url = `${baseURL}/getStudentTimetable`;

        const response = await axios.post(
          url,
          { semester: userData.semester, branch: userData.branch },
          {
            headers: headers,
            responseType: "arraybuffer",
          }
        );

        console.log("Timetable response:", response);

        if (response.data) {
          const arrayBuffer = response.data;
          const blob = new Blob([arrayBuffer], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setTimetable(url);
        } else {
          toast.error("Error: Empty response");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error fetching timetable");
      }
    };

    userData && getTimetable();
  }, [userData, userData.branch, userData.semester]);

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {timetable ? (
          <p
            className="flex justify-center items-center text-lg font-medium cursor-pointer hover:text-red-500 hover:scale-110 ease-linear transition-all duration-200 hover:duration-200 hover:ease-linear hover:transition-all"
            onClick={openPDF}
          >
            View
            <span className="ml-2">
              <BsFilePdf />
            </span>
          </p>
        ) : (
          <p className="text-red-500 font-medium">Timetable is not available yet.</p>
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
