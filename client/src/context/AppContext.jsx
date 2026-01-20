import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = (props) => {

  const currency=import.meta.env.VITE_CURRENCY
  const [allCourses,setAllCourses]=useState([])
  const fetchAllCourses=async()=>{
    setAllCourses(dummyCourses)
  }
  useEffect(()=>{
  fetchAllCourses()
  },[])
  const value = {
    currency,allCourses
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
