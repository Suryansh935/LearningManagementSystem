import React from 'react'
import {Route,Routes, useMatch} from 'react-router-dom'
import Home from './pages/students/Home'
import CourseList from './pages/students/CourseList'
import CourseDetails from './pages/students/CourseDetails'
import MyEnrollment from './pages/students/MyEnrollment'
import Player from './pages/students/Player'
import Loading from './components/Students/Loading'
import Dashboard from './pages/Educator/Dashboard'
import Educator from './pages/Educator/Educator'
import AddCourse from './pages/Educator/AddCourse'
import MyCourse from './pages/Educator/MyCourse'
import StudentsEnrolled from './pages/Educator/StudentsEnrolled'
import Navbar from './components/Students/Navbar'
import "quill/dist/quill.snow.css"
const App = () => {
  const isEducatorRoute=useMatch('/educator/*')
  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar/>}
      <Routes>
       <Route path='/' element={<Home/>}/>
         <Route path='/course-list' element={<CourseList/>}/>
          <Route path='/course-list/:input' element={<CourseList/>}/>
         <Route path='/course/:id' element={<CourseDetails/>}/>
          <Route path='/my-enrollments' element={<MyEnrollment/>}/>
          <Route path='/player/:courseId' element={<Player/>}/>
          <Route path='/loading/:path' element={<Loading/>}/>


          <Route path='/educator' element={<Educator/>}>
          <Route path='/educator' element={<Dashboard/>}/>
          <Route path='add-course' element={<AddCourse/>}/>
          <Route path='my-courses' element={<MyCourse/>}/>
          <Route path='student-enrolled' element={<StudentsEnrolled/>}/>
          </Route>
          
      </Routes>
    </div>
  )
}

export default App

