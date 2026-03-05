import express from 'express'
import { addCourse, updateRoleEducator,getEducatorCourses, educatorDashboardData, getEnrolledStudentsData } from '../controllers/educatorControllers.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleWare.js'

const educatorRouter=express.Router()

//Add Educator Role
educatorRouter.get('/update-role',updateRoleEducator)
educatorRouter.post('/add-course',upload.single('thumbnail'),protectEducator,addCourse)
educatorRouter.get('/courses',protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)



export default educatorRouter