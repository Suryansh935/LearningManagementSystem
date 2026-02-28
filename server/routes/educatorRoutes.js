import express from 'express'
import { addCourse, updateRoleEducator } from '../controllers/educatorControllers.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleWare.js'

const educatorRouter=express.Router()

//Add Educator Role
educatorRouter.get('/update-role',updateRoleEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)


export default educatorRouter