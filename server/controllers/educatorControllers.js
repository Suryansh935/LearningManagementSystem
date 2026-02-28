import { createClerkClient } from "@clerk/backend";
import Course from "../models/Course.js";
import {v2 as cloudinary} from 'cloudinary'

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


//add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body
    const imageFile = req.file
    const educatorId = req.auth.userId

    if (!imageFile) {
      return res.json({
        success: false,
        message: 'Thumbnail not attached'
      })
    }

    const parsedCourseData = JSON.parse(courseData)

    parsedCourseData.educator = educatorId

    // Create course only once
    const newCourse = await Course.create(parsedCourseData)

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    newCourse.thumbnail = imageUpload.secure_url

    await newCourse.save()

    res.json({
      success: true,
      message: 'Course Added'
    })

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}