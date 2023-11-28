import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import apiServer from "../../config/apiServer";
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const educationLevelMapping = {
    1: 'Postgrad',
    2: 'Undergrad',
    3: 'Diploma',
    4: 'Certificate',
};

const PieComponent = () => {
    const [educationLevelData, setEducationLevelData] = useState([]);

    // Fetch the student data and calculate counts for each education level
    const fetchData = async () => {
        try {
            const baseURL = apiServer.defaults.baseURL;
            const url = `${baseURL}/students`;
            const response = await axios.get(url);
            const students = response.data;

            if (students) {
                const educationLevels = {};

                students.forEach((student) => {
                    const { education_level } = student;
                    if (education_level) {
                        if (educationLevels[education_level]) {
                            educationLevels[education_level] += 1;
                        } else {
                            educationLevels[education_level] = 1;
                        }
                    }
                });

                // Convert the educationLevels object to an array of objects
                const educationLevelData = Object.keys(educationLevels).map((level) => ({
                    name: educationLevelMapping[level] || 'Unknown',
                    value: educationLevels[level],
                }));

                setEducationLevelData(educationLevelData);
            } else {
                console.error("Error getting students");
            }
        } catch (error) {
            console.error("An error occurred while fetching the students:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <PieChart width={400} height={400}>
                <Pie
                    data={educationLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {educationLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
            <div className='grid grid-cols-4'>
                {educationLevelData.map((item, index) => (
                    <p key={`name-${index}`} className='cursor-pointer font-bold'>{item.name}</p>
                ))}
            </div>
            <div className='grid grid-cols-4 mt-[15px]'>
                {COLORS.map((item, index) => (
                    <div key={`color-${index}`} className="h-[30px] w-[30px] " style={{ backgroundColor: item }}>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PieComponent;
