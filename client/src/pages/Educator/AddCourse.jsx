import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import "quill/dist/quill.snow.css";
import Quill from 'quill'
import { assets } from '../../assets/assets';

const AddCourse = () => {
  const quillRef=useRef(null);
  const editorRef=useRef(null);

  const [courseTitle,setCourseTitle]=useState('')
  const [coursePrice,setCoursePrice]=useState(0)
  const [discount,setDiscount]=useState(0)
  const [image,setImage]=useState(null)
  const [chapters,setChapters]=useState([])
  const [showPopup,setShowPopup]=useState('')
  const [currentChapterId,setCurrentChapterId]=useState(null)
  
  const [lectureDetails,setLectureDetails]=useState(
   {
    lecturTitle:'',
    lectureDuration:'',
    lectureUrl:'',
    isPreviewFree:false,
   }
  )
  //quill ref will allow user to write text in the editore box with differenr style and many more
  useEffect(()=>{
    if(!quillRef.current && editorRef.current){//check if quiil ref and editor ref are present
     quillRef.current=new Quill(editorRef.current,{
      theme:'snow',
     });
    }
  },[])

  return (
    <div className='h-screen overflow-scroll flex flex-col 
    items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
    
<form className='flex flex-col gap-6 max-w-3xl'>

  {/* Course Title */}
  <div className='flex flex-col gap-1'>
    <p className='font-medium'>Course Title</p>

    <input
      onChange={e=> setCourseTitle(e.target.value)}
      value={courseTitle}
      type="text"
      placeholder='Type here'
      className='outline-none md:py-2.5 py-2 px-3 rounded border
      border-gray-300 focus:border-blue-500 w-full'
      required
    />
  </div>

  {/* Course Description */}
  <div className='flex flex-col gap-1'>
    <p className='font-medium'>Course Description</p>

    <div 
      ref={editorRef}
      className='bg-white border border-gray-300 rounded min-h-[130px]'
    ></div>
    </div>
    <div className='flex items-center justify-between flex-wrap'>
      <div className='flex flex-col gap-1'>
        
        <p>Course Price</p>
       
        <input onChange={e=>setCoursePrice(e.target.value)}
        value={coursePrice} type='number' placeholder='0'
        className='outline-none md:py-2.5 py-2 px-3 w-28 rounded border
      border-gray-500' required/>

      </div>
      <div className='flex md:flex-row flex-col items-center gap-3'>
        <p>Course Thumbnail</p>
        
        <label htmlFor='thumbnailImage' 
        className='flex items-center gap-3'>

        <img src={assets.file_upload_icon} alt=""
        className='p-3 bg-blue-500 rounded'/>

        <input type="file" id='thumbnailImage'
        onChange={e=>setImage(e.target.files[0])}
        accept="image/*" hidden/>

        <img className='max-h-10' src={image ? 
        URL.createObjectURL(image):''} alt=""/>
       </label>
      </div>
    </div>
    <div className='flex flex-col gap-1'>
      <p>Discount %</p>
      <input onChange={e=>setDiscount(e.target.value)}
      value={discount} type="number" placeholder='0' min={0}
      max={100} className='outline-none md:py-2.5 py-2 w-28 px-3
      rounded border border-gray-500' requires/>
    </div>



</form>


     
    </div>
  )
}

export default AddCourse
