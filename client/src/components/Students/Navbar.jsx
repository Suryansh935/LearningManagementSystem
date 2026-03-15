import React, { useContext } from 'react'
import {assets} from '../../assets/assets.js'
import { Link } from 'react-router-dom'
import {useClerk,UserButton,useUser} from '@clerk/clerk-react'
import AppContext from '../../context/AppContext.jsx'
import { toast } from "react-toastify";
import axios from 'axios'
const Navbar = () => {
  
  const {navigate,isEducator,backendUrl,
    setIsEducator,getToken}=useContext(AppContext)

  const isCourseListPage=location.pathname.includes('/course-list')

  const {openSignIn}=useClerk()
  const {user}=useUser()

  const becomeEducator=async()=>{
    try{
       if(isEducator){
        navigate('/educator')
        return;
       }
       const token=await getToken()
       const {data}=await axios.get(backendUrl+'/api/educator/update-role',
        {headers:{authorization:`Bearer ${token}`}}
       )
       if(data.success){
        toast.success(data.message)
       }
       else{
        toast.error(data.message)
       }
    }
    catch(error){
      toast.error(error.message)
    }
  }
  
  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b 
    border-gray-500 py-4 ${isCourseListPage?"bg-white":"bg-cyan-100/70"}`}>
      <img onClick={()=>navigate('/')} src={assets.logo} 
      alt="logo" 
      className='w-28 lg:w-32 cursor-pointer'/>

      <div className='hidden md:flex 
      items-center gap-5 text-gray-500'>
        
        <div className='flex items-center gap-5'>{/*for laptop view.show my-enrollments & BecomeEducator button only when user is loggedin*/}
            {user &&
            <>
              <button onClick={becomeEducator}>{isEducator?'Educator Dashboard':
                'Become Educator'}
              </button>

            |<Link to='/my-enrollments'>My Enrollments</Link>
            </>}
        </div>

        {/*If user is already sign in then show userButton*/}
        {user?<UserButton/>
        :<button onClick={()=>openSignIn()} className='rounded-full bg-blue-600 text-white px-5 py-2'>
            Create Account
        </button>}
        </div>
        
        {/*for mobile view*/}
        <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
       <div className='flex items-center gap-5'>
        {user && 
        <>
       <button onClick={becomeEducator}>
        {isEducator?'Educator Dashboard':'Become Educator'}
        </button>

        <Link to='/my-enrollments'>My Enrollments</Link>
         </>}

        </div>
        {
           user ? <UserButton/>
          :<button onClick={()=>openSignIn()}><img src={assets.user_icon} alt=""/></button>
        }
        </div>

    </div>
  )
}

export default Navbar
