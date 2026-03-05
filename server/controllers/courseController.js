import Course from "../models/Course.js";

//get all Curses
export const getAllCourses=async(req,res)=>{
    try{
        const courses=await Course.find({isPublished:true})
        .select(['-courseContent','-enrolledStudents'])//remove course contetnt ans enrolled students from  courses
        .populate({path:'educator'})//in course model their is reference of user model .It will fetch user deails from there
        
        res.json({succes:true,courses})
    }catch(error){
     res.json({success:false,message:error.message})
    }
}

//Get course by id
export const getCourseId=async(req,res)=>{
    const {id}=req.params
    try{
        const courseData=await Course.findById(id)
        .populate({path:'educator'})//Populate:This replaces the educator ID 
                                    // inside the course with the full educator document.
         //Remove lectureUrl if isPreviewFree is false
         courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl="";
                }
            })
         })
          res.json({succes:true,courseData})
        }

    catch(error){
         res.json({succes:false,message:error.message});
    }
}