import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
const UserAvatar = () => {
    const { userData } = useSelector((state) => state);
    const [loading, setLoading] = useState(true);
    const [initials, setInitials] = useState("N/A");
    const [name, setName] = useState("N/A");

    // get user name
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const userName = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : null;
    // get initials
    const getInitials = () => {
        if (!userName) return "N/A";
        const nameArray = userName.trim().split(" ");
        if (nameArray.length === 1){
            return nameArray[0].charAt(0).toUpperCase();
        }
        else {
            return (
                nameArray[0].charAt(0).toUpperCase() +
                nameArray[nameArray.length - 1].charAt(0).toUpperCase()
            );
        }
    };
    useEffect(()=> {
        if(userName){
            setInitials(getInitials());
            setName(userName);
            setLoading(false);
        }
        else{
            setLoading(true);
        }
    })
    if(loading){
        return <div>Loading...</div>
    }
  return (
      <div className='flex items-center mx-6'>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2">{initials}</div> 
        <div className='font-bold text-sm text-gray-900'>{name}</div>
      </div>
  ) 
};

export default UserAvatar;