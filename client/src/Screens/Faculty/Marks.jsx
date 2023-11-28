import axios from "axios";
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import apiServer from "../../config/apiServer";

const Marks = () => {
  const [subject, setSubject] = useState();
  const [branch, setBranch] = useState();
  const [studentData, setStudentData] = useState();
  const [selected, setSelected] = useState({
    branch: "",
    semester: "",
    subject: "",
    examType: "",
    enrollment_no: "",
  });
  const [marksValue, setMarksValue] = useState({}); // State to store marks for all students
  const [commentsValue, setCommentsValue] = useState({}); // State to store comments for all students

  const loadStudentDetails = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const baseURL = apiServer.defaults.baseURL;
    const semester = parseInt(selected.semester, 10);

    // Use the enrollment_no from the selected state
    const enrollment_no = selected.enrollment_no;

    const url = `${baseURL}/loadStudentDetails`;
    axios
      .post(
        url,
        {
          branch: selected.branch,
          semester,
          enrollment_no, // Use the enrollment_no as a parameter
        },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setStudentData(response.data.student);
          console.log(response.data.student);
          setSelected({
            ...selected,
            enrollment_no: enrollment_no,
          });
          const score = {};
          score[enrollment_no] = "";
          setMarksValue(score);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Select correct Branch and Semester");
      });
  };

  const submitMarksHandler = () => {
    // Here, marksValue object contains marks for all students
    const enrollment_no = selected.enrollment_no;
    const score = marksValue[enrollment_no];

    setStudentMarksHandler(enrollment_no, score);
  };

  const setStudentMarksHandler = (enrollment, value) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/marks`; // Assuming it should be 'uploadMarks'.

    axios
      .post(
        url,
        {
          enrollment_no: selected.enrollment_no,
          score: value, // Updated to include the marks
          examType: selected.examType,
          subject: selected.subject,
        },
        console.log(selected.enrollment_no),
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error uploading student marks.");
      });
  };

  // get grades and remarks
  const getGradeAndRemarks = (score, education_level) => {
    let grade = "";
    let remarks = "";

    if (score === "") {
      return { grade, remarks };
    }

    const numericScore = parseFloat(score);

    if (education_level === "1") {
      if (numericScore >= 80 && numericScore <= 100) {
        grade = "A";
        remarks = "Excellent";
      } else if (numericScore >= 70 && numericScore <= 79) {
        grade = "B";
        remarks = "Good";
      } else if (numericScore >= 60 && numericScore <= 69) {
        grade = "C";
        remarks = "Satisfactory";
      } else if (numericScore >= 50 && numericScore <= 59) {
        grade = "D";
        remarks = "Average/Pass";
      } else if (numericScore >= 0 && numericScore <= 49) {
        grade = "E";
        remarks = "Fail";
      }
    } else {
      if (numericScore >= 70 && numericScore <= 100) {
        grade = "A";
        remarks = "Excellent";
      } else if (numericScore >= 60 && numericScore <= 69) {
        grade = "B";
        remarks = "Good";
      } else if (numericScore >= 50 && numericScore <= 59) {
        grade = "C";
        remarks = "Satisfactory";
      } else if (numericScore >= 40 && numericScore <= 49) {
        grade = "D";
        remarks = "Average/Pass";
      } else if (numericScore >= 0 && numericScore <= 39) {
        grade = "E";
        remarks = "Fail";
      }
    }

    return { grade, remarks };
  };

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/branches`;
    axios
      .get(url, { headers })
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const getSubjectData = () => {
    toast.loading("Loading Subjects");
    // Create the full URL separately
    const baseURL = apiServer.defaults.baseURL;
    const url = `${baseURL}/subjects`;
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
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
  };

  useEffect(() => {
    getBranchData();
    getSubjectData();
  }, []);

  const resetValueHandler = () => {
    setStudentData();
  };

  return (
    <div className="w-[85%] mx-auto flex justify-center items-start flex-col my-10">
      <div className="relative flex justify-between items-center w-full">
        <Heading title={`Upload Marks`} />
        {studentData && (
          <button
            className="absolute right-2 flex justify-center items-center border-2 border-red-500 px-3 py-2 rounded text-red-500"
            onClick={resetValueHandler}
          >
            <span className="mr-2">
              <BiArrowBack className="text-red-500" />
            </span>
            Close
          </button>
        )}
      </div>
      {!studentData && (
        <>
          <div className="mt-10 w-full grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="enrollment_no" className="leading-7 text-base">
                Enter Enrollment Number
              </label>
              <input
                type="text"
                id="enrollment_no"
                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                value={selected.enrollment_no}
                onChange={(e) =>
                  setSelected({ ...selected, enrollment_no: e.target.value })
                }
                placeholder="Enter Enrollment Number"
              />
            </div>

            <div>
              <label htmlFor="branch" className="leading-7 text-base">
                Select Branch
              </label>
              <select
                id="branch"
                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                value={selected.branch}
                onChange={(e) =>
                  setSelected({ ...selected, branch: e.target.value })
                }
              >
                <option defaultValue>-- Select --</option>
                {branch &&
                  branch.map((branch) => {
                    return (
                      <option value={branch.name} key={branch.name}>
                        {branch.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label htmlFor="semester" className="leading-7 text-base">
                Select Semester
              </label>
              <select
                id="semester"
                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                value={selected.semester}
                onChange={(e) =>
                  setSelected({ ...selected, semester: e.target.value })
                }
              >
                <option defaultValue>-- Select --</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="leading-7 text-base">
                Select Subject
              </label>
              <select
                id="subject"
                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                value={selected.subject}
                onChange={(e) =>
                  setSelected({ ...selected, subject: e.target.value })
                }
              >
                <option defaultValue>-- Select --</option>
                {subject &&
                  subject.map((subject) => {
                    return (
                      <option value={subject.name} key={subject.name}>
                        {subject.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label htmlFor="examType" className="leading-7 text-base">
                Select Exam Type
              </label>
              <select
                id="examType"
                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
                value={selected.examType}
                onChange={(e) =>
                  setSelected({ ...selected, examType: e.target.value })
                }
              >
                <option defaultValue>-- Select --</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>
          <button
            className="bg-blue-50 px-4 py-2 mt-8 mx-auto rounded border-2 border-blue-500 text-black"
            onClick={loadStudentDetails}
          >
            Load Student Data
          </button>
        </>
      )}
      {studentData && Object.keys(studentData).length !== 0 && (
        <>
          <p className="mt-4 text-lg">
            Upload {selected.examType} Marks Of student {selected.enrollment_no}{" "}
            of {selected.branch} Semester {selected.semester} of{" "}
            {selected.subject}
          </p>
          <div
            className="w-full flex flex-wrap justify-center items-center mt-8 gap-4"
            id="markContainer"
          >
            <div className="w-full">
              <input
                type="number"
                className="px-6 py-2 focus:ring-0 outline-none w-full"
                placeholder="Enter Marks"
                value={marksValue[selected.enrollment_no]}
                onChange={(e) => {
                  const enteredScore = e.target.value;
                  if (enteredScore >= 0 && enteredScore <= 100) {
                    setMarksValue({
                      ...marksValue,
                      [selected.enrollment_no]: enteredScore,
                    });
                  } else {
                    toast.error(
                      "Invalid score. Please enter a score between 0 and 100."
                    );
                  }
                }}
              />
            </div>
            <div className="w-full">
              <textarea
                rows="4"
                className="px-6 py-2 focus:ring-0 outline-none w-full"
                placeholder="Comments and Additional Information"
                value={commentsValue[selected.enrollment_no] || ""}
                onChange={(e) => {
                  const enteredComments = e.target.value;
                  setCommentsValue({
                    ...commentsValue,
                    [selected.enrollment_no]: enteredComments,
                  });
                }}
              />
            </div>
          </div>
          {studentData.education_level &&
            marksValue[selected.enrollment_no] >= 0 &&
            marksValue[selected.enrollment_no] <= 100 && (
              <div>
                <p>
                  Grade:{" "}
                  {
                    getGradeAndRemarks(
                      marksValue[selected.enrollment_no],
                      studentData.education_level
                    ).grade
                  }
                </p>
                <p>Score: {marksValue[selected.enrollment_no]}%</p>
                <p>
                  Remarks:{" "}
                  {
                    getGradeAndRemarks(
                      marksValue[selected.enrollment_no],
                      studentData.education_level
                    ).remarks
                  }
                </p>
              </div>
            )}
          <button
            className="bg-blue-500 px-6 py-3 mt-8 mx-auto rounded text-white"
            onClick={submitMarksHandler}
          >
            Upload Student Marks
          </button>
        </>
      )}
    </div>
  );
};

export default Marks;
