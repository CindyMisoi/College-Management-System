import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Heading from "../../components/Heading";
import apiServer from "../../config/apiServer";
 
const Marks = () => {
  const { userData } = useSelector((state) => state);
  const [marks, setMarks] = useState([]);
  const [educationLevel, setEducationLevel] = useState(null);
  const [classification, setClassification] = useState("");
  const [awards, setAwards] = useState("");
  const [loading, setLoading] = useState(true);

  const getGradeAndRemarks = (score, educationLevel) => {
    let grade, remarks;
  
    if (educationLevel === "1") { // Postgraduate 
      if (score >= 80 && score <= 100) {
        grade = 'A';
        remarks = 'Excellent';
      } else if (score >= 70 && score <= 79) {
        grade = 'B';
        remarks = 'Good';
      } else if (score >= 60 && score <= 69) {
        grade = 'C';
        remarks = 'Satisfactory';
      } else if (score >= 50 && score <= 59) {
        grade = 'D';
        remarks = 'Average/Pass';
      } else {
        grade = 'E';
        remarks = 'Fail';
      }
    } else { // Undergraduate/Diploma/Certificate
      if (score >= 70 && score <= 100) {
        grade = 'A';
        remarks = 'Excellent';
      } else if (score >= 60 && score <= 69) {
        grade = 'B';
        remarks = 'Good';
      } else if (score >= 50 && score <= 59) {
        grade = 'C';
        remarks = 'Satisfactory';
      } else if (score >= 40 && score <= 49) {
        grade = 'D';
        remarks = 'Average/Pass';
      } else {
        grade = 'E';
        remarks = 'Fail';
      }
    }
  
    return { grade, remarks };
  };

  const fetchData = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
  
      const baseURL = apiServer.defaults.baseURL;
      const studentDetailsURL = `${baseURL}/getStudentDetails`;
      const marksURL = `${baseURL}/getStudentMarks`;
  
      // Fetch student details and marks in parallel using Promise.all
      const [studentResponse, marksResponse] = await Promise.all([
        axios.post(studentDetailsURL, { enrollment_no: userData.enrollment_no }, { headers }),
        axios.post(marksURL, { enrollment_no: userData.enrollment_no }, { headers }),
      ]);
  
      if (studentResponse.data.success) {
        const { education_level } = studentResponse.data.student;
        setEducationLevel(education_level);
  
        if (marksResponse.data && marksResponse.data.marks && Array.isArray(marksResponse.data.marks)) {
          const markedMarks = marksResponse.data.marks.map((mark) => ({
            ...mark,
            grade: getGradeAndRemarks(mark.score, education_level).grade,
            remarks: getGradeAndRemarks(mark.score, education_level).remarks,
          }));
          setMarks(markedMarks);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false); // Set loading state to false after data processing is complete
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <Heading title={`Marks of Semester ${userData.semester}`} />
      <div className="mt-14 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : marks.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Subject</th>
                <th className="border border-gray-400 px-4 py-2">Exam Type</th>
                <th className="border border-gray-400 px-4 py-2">Score</th>
                <th className="border border-gray-400 px-4 py-2">Grade</th>
                <th className="border border-gray-400 px-4 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">{mark.subject}</td>
                  <td className="border border-gray-400 px-4 py-2">{mark.examType}</td>
                  <td className="border border-gray-400 px-4 py-2">{mark.score}</td>
                  <td className="border border-gray-400 px-4 py-2">{mark.grade}</td>
                  <td className="border border-gray-400 px-4 py-2">{mark.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="w-1/2 shadow-md p-4">No Marks Available At The Moment!</p>
        )}
      </div>
    </div>
  );
};

export default Marks;
