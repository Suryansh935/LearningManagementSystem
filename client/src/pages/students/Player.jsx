import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/Students/Footer'
import Rating from '../../components/Students/Rating'

const Player = () => {
  const {enrolledCourses,setEnrolledCourses,calculateChapterTime}=useContext(AppContext)
  const {courseId}=useParams()
  const [courseData,setCourseData]=useState(null)
  const [openSections,setOpenSections]=useState({})
  const [playerData,setPlayerData]=useState(null)

  const getCourseData=()=>{
    enrolledCourses.map((course)=>{
      if(course._id===courseId){
        setCourseData(course)
      }
    })
  }

const toogleSection=(index)=>{
      setOpenSections((prev)=>(
         {...prev,
          [index]:!prev[index]
         }
      ))
  }
  useEffect(()=>{
    getCourseData()
  },[enrolledCourses])
  return (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse
    md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/**left Column */}
      <div className='text-gray-800'>
      
      <h2 className='text-xl font-semibold'>
      Course Structure</h2>
      
      <div className="pt-5">
        
        {courseData && courseData.courseContent.map((chapter, index) => (
          
          <div
            key={index}
            className="border border-gray-300 bg-white mb-2 rounded"
            onClick={()=>toogleSection(index)}>

            {/* Chapter Header */}
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
              
              <div className="flex items-center gap-2">
                
                <img className={`tranform transition-transform 
                ${openSections[index]?'rotate-180':''}`}
                src={assets.down_arrow_icon} alt="arrow" />

                <p className="font-medium md:text-base text-sm">
                  {chapter.chapterTitle}
                </p>

              </div>

              <p className="text-sm">
                {chapter.chapterContent.length} lectures •{" "}
                {calculateChapterTime(chapter)}
              </p>

            </div>

            {/* Lectures */}
            <div className={`overflow-hidden transition-all duration-300 
            ${openSections[index]?'max-h-96':'max-h-0'}`}>

            <ul className="px-4 pb-3 space-y-2">
              {chapter.chapterContent.map((lecture, i) => (

                <li
                  key={i}
                  className="flex gap-3 items-start text-sm"
                >
                  <img
                    src={false ? assets.blue_tick_icon :assets.play_icon}
                    alt="play"
                    className="w-4 h-4 mt-1"
                  />

                  <div className="flex flex-col">
                    <p className="font-medium">
                      {lecture.lectureTitle}
                    </p>

                    <div className="flex gap-2 text-gray-500">
                      {lecture.lectureUrl &&
                        (
                        <span onClick={()=>setPlayerData({
                          ...lecture,chapter:index+1,lecture:i+1})}

                          className="text-green-600 cursor-pointer">Watch</span>
                      )}

                      <span>
                        {humanizeDuration(
                          lecture.lectureDuration * 60 * 1000,
                          { units: ["h", "m"] }
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            </div>
          </div>
        ))}
      </div>
      <div className='flex items-center gap-2 py-3 mt-10'>
        <h1 className='text-xl font-bold'>Rate this Course:</h1>
        <Rating initialRating={0}/>
      </div>
      </div>
        {/**right Column */}
      <div>
        {playerData
        ?
        (<div className='md:mt-10'>
        <YouTube videoId={playerData.lectureUrl.split('/').pop()}
         iframeClassName="w-full aspect-video"/>
        
        <div className='flex justify-between items-center mt-1'> 

        <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>

        <button className='text-blue-600'>
        {false ? 'Completed':'Mark Complete'}
        </button>

        </div>
        </div>)
         :
        <img src={courseData
          ?
          courseData.courseThumbnail
          :
          ''} alt=""/>
          }
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Player
