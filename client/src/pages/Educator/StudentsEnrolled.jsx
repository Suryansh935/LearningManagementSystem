import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/Students/Loading'

const StudentsEnrolled = () => {

  const [enrolledStudents,setEnrolledStudents]=useState(null)

  const fetchEnrolledStudents=async()=>{
    setEnrolledStudents(dummyStudentEnrolled)
  }

  useEffect(()=>{
   fetchEnrolledStudents()
  },[])

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col md:p-8 
    md:pb-0 p-4 pt-8 pb-0 justify-between items-start'>
     
      <div className='flex flex-col items-center w-full 
      overflow-hidden rounded-md bg-white border border-gray-500/20'>
        
        <div className='w-full overflow-x-auto'>
         <table className='w-full table-auto pb-4'>

            <thead className='text-gray-900 border-b 
            border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-4 font-semibold 
                text-center hidden sm:table-cell'>#</th>

                <th className='px-6 py-4 font-semibold'>Student Name</th>
                <th className='px-6 py-4 font-semibold'>Course Title</th>

                <th className='px-6 py-4 font-semibold 
                hidden sm:table-cell'>Date</th>
              </tr>
            </thead>

            <tbody>
             {enrolledStudents.map((item,index)=>(
              <tr key={index} className='border-b border-gray-500/20'>
                
                <td className='px-4 py-3 text-center 
                hidden sm:table-cell'>{index+1}</td>
                
                <td className='px-6 py-3'>
                  <div className='flex items-center space-x-3'>
                    <img src={item.student.imageUrl}
                      alt="" className='w-9 h-9 rounded-full'/>

                    <span className='truncate'>
                      {item.student.name}
                    </span>
                  </div>
                </td>

                <td className='px-6 py-3 truncate'>
                  {item.courseTitle}
                </td>

                <td className='px-6 py-3 hidden sm:table-cell'>
                  {new Date(item.purchaseDate).toLocaleString()}
                </td>
                
              </tr>
             ))}
            </tbody>
         </table>
        </div>
        
      </div>
    </div>
  )
  :
  <Loading/>
}

export default StudentsEnrolled
