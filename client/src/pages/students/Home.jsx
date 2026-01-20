import React from 'react'
import Hero from '../../components/Students/Hero'
import Companies from '../../components/Students/Companies'
import CourseSection from '../../components/Students/CourseSection'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
     <Hero/>
     <Companies/>
     <CourseSection/>
    </div>
  )
}

export default Home
