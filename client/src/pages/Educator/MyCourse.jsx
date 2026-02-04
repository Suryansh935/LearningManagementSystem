import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../context/AppContext'
import Loading from '../../components/Students/Loading'

const MyCourse = () => {
  const {currency,allCourses}=useContext(AppContext)
  const [courses,setCourses]=useState(null)
  const fetchEducatorCourses=async()=>{
    setCourses(allCourses)
  }

  useEffect(()=>{
    fetchEducatorCourses()
  },[])

  return courses 
  ? 
  (
    <div className='h-screen flex flex-col items-start 
    justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>

     <div className='w-full'>

      <h2 clasName='pb-4 text-lg f
      ont-medium'>My Courses</h2>
      
      <div className='flex flex-col items-center 
      max-w-4xl w-full overflow-hidden rounded-md 
      bg-white border border-gray-500/20'>

        {/*table to show courses earnigns students and published on*/}

        <table className='md:table-auto table-fixed 
        w-full overflow-hidden'>

          <thead className='text-gray-900 border-b 
          border-gray-500/20text-sm text-left'>
          <tr>
            <th className='px-4 py-3 font-semibold 
            truncate'>All Courses</th>

            <th className='px-4 py-3 font-semibold 
            truncate'>Earnings</th>

            <th className='px-4 py-3 font-semibold 
            truncate'>Students</th>

            <th className='px-4 py-3 font-semibold 
            truncate'>Published On</th>
          </tr>
          

          </thead>

          <tbody className='text-sm text-gray-500'>
            {courses.map((course)=>{
              <tr key={course._id} className=
              'border-b border-gray-500/20'>

                <td className='md:px-4 pl-2 md:pl-4 py-3 flex
                 items-center spca-x-3 truncate'>

                  <img src={course.courseThumbnail} 
                  alt="Course Image" className='w-16'/>


                 </td>

              </tr>
            })}

          </tbody>
        </table>
        
      </div> 
     </div>
    </div>
  )
  :
  <Loading/>
}

export default MyCourse
