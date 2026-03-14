import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";

const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendUrl=import.meta.env.VITE_BACKEND_URL

  const currency=import.meta.env.VITE_CURRENCY
  const navigate=useNavigate()

  const {getToken}=useAuth()
  const {user}=useUser()

  const [isEducator,setIsEducator]=useState(false)
  const [allCourses,setAllCourses]=useState([])
  const[enrolledCourses,setEnrolledCourses]=useState([])
  const [userData,setUserData]=useState([])

  const fetchAllCourses=async()=>{
     try{
      const {data}=await axios.get(backendUrl+'/api/course/all');
      console.log("API Response:", data); 

      if(data.success){
        setAllCourses(data.courses)
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  //Function to calcualte average rating of course
  const calculateRating=(course)=>{
    if(course.courseRatings.length===0){
      return 0;
    }
    let totalRating=0
    course.courseRatings.forEach(rating=>{
      totalRating+=rating.rating
  })
  return totalRating/course.courseRatings.length
  }
  

  //Function to Calculate course Chapter Time
  const calculateChapterTime=(chapter)=>{
    let time=0
    chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
    return humanizeDuration(time*60*1000,{units:["h","m"]})
  }
//Function to calculate course Duration
  const calculateCourseDuration=(course)=>{
    let time=0;
    course.courseContent.map((chapter)=>chapter.chapterContent.map(
      (lecture)=>time+=lecture.lectureDuration
    ))
    return humanizeDuration(time*60*1000,{units:["h","m"]})
  }
  //Function to calculate no of lectures int the course
  const calculateTotalLectures=(course)=>{
    let totalLectures=0;
    course.courseContent.forEach(chapter=>{
      if(Array.isArray(chapter.chapterContent)){
        totalLectures+=chapter.chapterContent.length
      }
    })
    
    return totalLectures;
  }

  //Fetch user Enrolled Courses
  const fetchUserEnrolledCourses=async()=>{
    setEnrolledCourses(dummyCourses)
  }

  useEffect(()=>{
  fetchAllCourses()
  fetchUserEnrolledCourses()
  },[])
  
  const logToken=async()=>{
    console.log(await getToken());
  }
  
  useEffect(()=>{
  if(user){
    logToken()
  }
  },[user])

  const value =
   {
    currency,allCourses,enrolledCourses,navigate,calculateRating,
    isEducator,setIsEducator,calculateChapterTime,
    calculateCourseDuration,calculateTotalLectures,
    
  };


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
