import { createClerkClient } from "@clerk/backend";
import Course from "../models/Course.js";
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js"

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
export const updateRoleEducator = async (req, res) => {
  try {

    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" }
    });

    return res.json({
      success: true,
      message: "Role updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const addCourse = async (req, res) => {
  try {

    const courseData = req.body?.courseData
    const imageFile = req.file
    const { userId } = req.auth()

    if (!imageFile) {
      return res.json({
        success:false,
        message:"Thumbnail not attached"
      })
    }

    const parsedCourseData = JSON.parse(courseData)

    // find user in mongodb using clerkId
   const educator = await User.findById(userId)

    if(!educator){
      return res.json({
        success:false,
        message:"Educator not found"
      })
    }

    parsedCourseData.educator = educator._id

    const newCourse = await Course.create(parsedCourseData)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    newCourse.courseThumbnail = imageUpload.secure_url

    await newCourse.save()

    res.json({
      success:true,
      message:"Course Added"
    })

  } catch(error){
    res.json({
      success:false,
      message:error.message
    })
  }
}


//get Educator Courses
export const getEducatorCourses=async(req,res)=>{
  try{
    const educator=req.auth.userId
    const courses=await Course.find({educator})
    res.json({sucess:true,courses})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}

//get educator Dashboard data(Total earning,Enrolled students,no of Courses)
export const educatorDashboardData=async()=>{
  try{
    const educator=req.auth.userId;
    const courses=await Course.find({educator});
    const totalCourses=courses.length;

    const courseIds=courses.map(course=>course._id);
    
    //calculate total earnin from purchases
    const purchases=await Purchase.find({
      courseId:{$in:courseIds},
      status:'completed'
    });

    const totalEarnings=purchases.reduce((sum,purchase)=>sum+purchase.amount,0);

    //collect unique enrolled student ids with their course titles
    const enrolledStudentData=[];
    for(const course of courses){
       const students = await user.find({
        _id:{$in:course.enrolledStudents}
       },'name imageUrl');

       students.forEach(student=>{
        enrolledStudentData.push({
          courseTitle:course.courseTitle,
          student
        });
       });
    }
    res.json({success:true,dashboardData:{
      totalEarnings,enrolledStudentData,totalCourses
    }})
  }
  catch(error){
    res.json({success:false,message:error.message});
  }
}

//get Enrolled students data with purchase data
export const getEnrolledStudentsData=async(req,res)=>{
  try{
    const educator=req.auth.userId;
    const courses=await Course.find({educator});
    const courseIds=courses.map(course=>course._id);

    const purchases=await Purchase.find({
      courseId:{$in:courseIds},
      status:'completed'
    }).populate('userId','name','imageUrl').populate('courseId','courseTitle')
    //Replace userId with user details (only name & imageUrl)

    const enrolledStudents=purchases.map(purchase=>({
      student:purchase.userId,
      courseTitle:purchase.courseId.courseTitle,
      purchaseDate:purchase.createdAt
    }));
    res.json({success:true,enrolledStudents})
  }
  catch(error){
    res.json({success:false,message:error.message});
  }
}
