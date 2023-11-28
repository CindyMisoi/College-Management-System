import React, { useState, useEffect } from 'react'
import {BsFillPeopleFill} from "react-icons/bs"
import {FiMap} from "react-icons/fi";
import { Progress } from 'antd';
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, } from 'recharts';
import PieComponent from './PieComponent';
import apiServer from "../../config/apiServer";
import  axios  from 'axios';

const datas = [
    {
        name: 'Year 2018',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Year 2019',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Year 2020',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Year 2022',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Year 2023',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
];


const Home = () => {
    const [studentCount, setStudentCount] = useState(null);
    const [facultyCount, setFacultyCount] = useState(null);
    const [adminCount, setAdminCount] = useState(null);
    const [branchCount, setBranchCount] = useState(null);

    const countStudent = () => {
        // Make an API request to get the student count
        const baseURL = apiServer.defaults.baseURL;
        const url = `${baseURL}/studentCount`;
        axios.get(url)
          .then((response) => {
            if (response.data.success) {
              setStudentCount(response.data.count);
            } else {
              console.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error("An error occurred while fetching the student count:", error);
          });
      };

      const countFaculty = () => {
        // Make an API request to get the student count
        const baseURL = apiServer.defaults.baseURL;
        const url = `${baseURL}/facultyCount`;
        axios.get(url)
          .then((response) => {
            if (response.data.success) {
              setFacultyCount(response.data.count);
            } else {
              console.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error("An error occurred while fetching the student count:", error);
          });
      };
      const countAdmin = () => {
        // Make an API request to get the student count
        const baseURL = apiServer.defaults.baseURL;
        const url = `${baseURL}/adminCount`;
        axios.get(url)
          .then((response) => {
            if (response.data.success) {
              setAdminCount(response.data.count);
            } else {
              console.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error("An error occurred while fetching the student count:", error);
          });
      };
      const countBranch = () => {
        // Make an API request to get the branch count
        const baseURL = apiServer.defaults.baseURL;
        const url = `${baseURL}/branchCount`;
        axios.get(url)
          .then((response) => {
            if (response.data.success) {
              setBranchCount(response.data.count);
            } else {
              console.error(response.data.message);
            }
          })
          .catch((error) => {
            console.error("An error occurred while fetching the student count:", error);
          });
      };
   
    
      useEffect(() => {
        countStudent();
        countFaculty();
        countAdmin();
        countBranch();
      }, [])

    return (
        <div className='px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]'>
            <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
                <div className=' h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>TOTAL STUDENTS</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{studentCount}</h1>
                    </div>
                    <BsFillPeopleFill fontSize={28} color="" />

                </div>
                <div className=' h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>
                            TOTAL FACULTY</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{facultyCount}</h1>
                    </div>
                    <BsFillPeopleFill fontSize={28} />
                </div>
                <div className=' h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>TOTAL ADMINS </h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{adminCount}</h1>
                    </div>
                    <BsFillPeopleFill fontSize={28} />
                </div>
                <div className=' h-[100px] rounded-[8px] bg-gray-200 border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>BRANCHES</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{branchCount}</h1>
                    </div>
                    <FiMap fontSize={28} />
                </div>

            </div>
            <div className='flex mt-[22px] w-full gap-[30px]'>
                <div className='basis-[70%] border bg-slate-700 shadow-lg shadow-slate-500/40 cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Graduates Overview</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <div className="w-full">
                        {/* <canvas id="myAreaChart"></canvas> */}
                        {/* <Line options={options} data={data} /> */}
                        <LineChart
                            width={900}
                            height={500}
                            data={datas}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                    </div>

                </div>
                <div className='basis-[30%] border bg-gray-300 shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Graduates</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='pl-[35px]'>

                        <PieComponent />

                        {

                        }
                    </div>
                </div>
            </div>
            <div className='flex mt-[22px] w-full gap-[30px]'>
                <div className='basis-[55%] border bg-gray-100 shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>Grades Overview</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='px-[25px] space-y-[15px] py-[15px]'>
                        <div>
                            <h2>Execellent</h2>
                            <Progress percent={10} strokeColor="#E74A3B" />
                        </div>
                        <div>
                            <h2>Good</h2>
                            <Progress percent={20} strokeColor="#F6C23E" />
                        </div>
                        <div>
                            <h2>Satisfactory</h2>
                            <Progress percent={30} strokeColor="#4E73DF" />
                        </div>
                        <div>
                            <h2>Pass</h2>
                            <Progress percent={30} strokeColor="#36B9CC" />
                        </div>
                        <div>
                            <h2>Fail</h2>
                            <Progress percent={10}  strokeColor="#1CC88A" />
                        </div>
                    </div>





                </div>
                <div className='basis-[45%] border bg-gray-100 shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'> Resources</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>
                    <div className='pl-[35px] flex items-center justify-center h-[100%]'>
                        <div>
                            <p className='mt-[15px] text-semibold text-gray-500'>No data available</p>
                        </div>
                    </div>
                </div>
            </div>


        </div >
    )
}

export default Home   