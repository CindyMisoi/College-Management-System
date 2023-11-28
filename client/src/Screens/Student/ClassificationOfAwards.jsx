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
  const [meanScore, setMeanScore] = useState(null);
  const [classification, setClassification] = useState("");
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(false);

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

          const totalScore = markedMarks.reduce((acc, mark) => acc + mark.score, 0);
          const mean = totalScore / markedMarks.length;
          setMeanScore(mean);

          // Calculate classification and awards based on the mean score and education level
          if (educationLevel === "1") {
            if (mean >= 50 && mean <= 100) {
              setClassification('Pass');
            } else if (mean >= 0 && mean <= 49) {
              setClassification('Fail');
            }
          } else if (educationLevel === "2") {
            if (mean >= 70 && mean <= 100) {
              setClassification('1st Class Honors');
            } else if (mean >= 60 && mean <= 69) {
              setClassification('2nd Class Honors Upper Division');
            } else if (mean >= 50 && mean <= 59) {
              setClassification('2nd Class Honors Lower Division');
            } else if (mean >= 40 && mean <= 49) {
              setClassification('Pass');
            } else if (mean >= 0 && mean <= 39) {
              setClassification('Fail');
            }
          } else if (educationLevel === "3" || educationLevel === "4") {
            if (mean >= 70 && mean <= 100) {
              setClassification('Distinction');
            } else if (mean >= 55 && mean <= 69) {
              setClassification('Credit');
            } else if (mean >= 40 && mean <= 54) {
              setClassification('Pass');
            } else if (mean >= 0 && mean <= 39) {
              setClassification('Fail');
            }
          }
        } else {
          toast.error("No Marks Available At The Moment!"); 
        } 
      } else {
        toast.error(studentResponse.data.message);
      }
      setRerender((prev) => !prev);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false); // Set loading state to false after data processing is complete
    }
  };

  useEffect(()=>{
fetchData();
  }, [rerender])
  
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

        {meanScore !== null && (
          <div className="mt-4">
            <p>Mean Score: {meanScore}</p>
            <p>Classification of Awards: {classification}</p>
          </div>
        )}
      </div> 
    </div>
  );
};
 
export default Marks;
