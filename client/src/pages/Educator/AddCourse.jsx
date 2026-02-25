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
    lectureTitle:'',
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

  const handleChapter=(action,chapterId)=>{
    if(action==='add'){
      const title=prompt('Enter chapter name:');
      if(title){
        const newChapter={
          chapterId:uniqid(),
          chapterTitle:title,
          chapterContent:[],
          collapsed:false,
          chapterOrder:chapters.length>0 
          ?
           chapters.slice(-1)[0].chapterorder+1
           :
           1,
        };
        setChapters([...chapters,newChapter]);//here ... in chapters is used so that 
                                              //previous data inside the chapter  doent 
                                              // get replaces with new chapter value
}
      }
      else if(action==='remove'){
        setChapters(chapters.filter((chapter)=>
          chapter.chapterId!==chapterId));
      }
      else if(action==='toggle'){
        setChapters(
          chapters.map((chapter)=>chapter.chapterId===chapterId
          ?
          {...chapter,collapsed:!chapter.collapsed}
          :
          chapter
        )
        )
      }
    }
    

 //add Lectures
// This function adds a new lecture to the currently selected chapter.
// It loops through all chapters using map() and finds the chapter whose id
// matches currentChapterId. Once found, it creates a new lecture object using
// lectureDetails and assigns a lectureOrder.
// If the chapter already has lectures, order = last lecture order + 1,
// otherwise order starts from 1.
// Then the new lecture is pushed into that chapter's chapterContent array
// and the updated chapters state is saved using setChapters().
    const addLecture=()=>{
      setChapters(
        chapters.map((chapter)=>{
          if(chapter.chapterId===currentChapterId){
            const newLecture={
              ...lectureDetails,
              lectureOrder:chapter.chapterContent.length>0 
              ?
              chapters.slice(-1)[0].lecturerOrder+1
              :
              1,
            };
            chapter.chapterContent.push(newLecture)
          }
          return chapter;
        })
      );
      setShowPopup(false);
      setLectureDetails({
        lecturTitle:'',
        lectureDuration:'',
        lectureUrl:'',
        isPreviewFree:false,
      })
    }
  // This function handles lecture actions like adding or removing a lecture.
// It receives three parameters:
// action → tells what to do ("add" or "remove")
// chapterId → identifies which chapter to modify
// lectureIndex → tells which lecture to remove from that chapter

// If action is "add":
// It sets the current chapter id and opens the popup form to add a new lecture.

// If action is "remove":
// It loops through all chapters using map(), finds the matching chapter using chapterId,
// and removes the lecture at lectureIndex from that chapter's lecture array using splice().
// Finally, it updates the chapters state with the modified data.
    
const handleLecture = (action, chapterId, lectureIndex) => {
  if (action === 'add') {
    setCurrentChapterId(chapterId);
    setShowPopup(true);
  }

  else if (action === 'remove') {
    setChapters(prevChapters =>
      prevChapters.map(chapter => {
        if (chapter.chapterId === chapterId) {
          return {
            ...chapter,
            chapterContent: chapter.chapterContent.filter(
              (_, index) => index !== lectureIndex
            )
          };
        }
        return chapter;  // ✅ must return unchanged chapter
      })
    );
  }
};
   
    const handleSubmit=async(e)=>{
      e.preventDefault()
    }
  return (
    <div className='h-screen overflow-scroll flex flex-col 
    items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
    
    <form className='flex flex-col 
    gap-6 max-w-3xl' onSubmit={handleSubmit}>

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
    
    {/*course proce ans course thumbnail upload field*/}
    <div className='flex items-center justify-between flex-wrap'>
      <div className='flex flex-col gap-1'>
        
        <p>Course Price</p>
       
        <input onChange={e=>setCoursePrice(e.target.value)}
        value={coursePrice} type='number' placeholder='0'
        className='outline-none md:py-2.5 py-2 px-3 w-28 rounded border
      border-gray-500' required/>

      </div>
      {/** course thumbnail upload field*/}  
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

     {/**Discount % input field */}
    <div className='flex flex-col gap-1'>
      <p>Discount %</p>
      <input onChange={e=>setDiscount(e.target.value)}
      value={discount} type="number" placeholder='0' min={0}
      max={100} className='outline-none md:py-2.5 py-2 w-28 px-3
      rounded border border-gray-500' requires/>
    </div>

     {/*Adding chapters and lectures*/}
     <div>
      {chapters.map((chapter,chapterIndex)=>(
       <div key={chapterIndex} className='
       bg-white border rounded-lg mb-4 '>

        <div className='flex justify-between 
        items-center p-4 border-b'>
        
        <div className='flex items-center'>

         <img src={assets.dropdown_icon}
          width={14} alt="" className={`mr-2 
          cursor-pointer transition-all 
          ${chapter.collapsed && "-rotate-90"}`}
          onClick={()=>handleChapter('toggle',
          chapter.chapterId)}/>

          <span className='font-semibold'>
          {chapterIndex+1} {chapter.chapterTitle}
          </span>
         </div>

        <span className='text-gray-500'>
        {chapter.chapterContent.length}{" "}
        {chapter.chapterContent.length === 1 ? "Lecture" : "Lectures"}
      </span>
          
          <img src={assets.cross_icon} alt="" 
          className='cursor-pointer' onClick={()=>
          handleChapter('remove',chapter.chapterId)}/>

           </div>
           
           {!chapter.collapsed && (
            <div className='p-4'>
              
              {chapter.chapterContent.map((lecture,lectureIndex)=>(
                
                <div key={lectureIndex} className='flex 
                justify-between items-center mb-2'>

                  <span>{lectureIndex+1} {lecture.lectureTitle}-
                   {lecture.lectureDuration} mins - <a href=
                   {lecture.lectureUrl} target="_blank" className='
                   text-blue-500'>Link</a>-{lecture.isPreviewFree ? 
                   'Free Preview' :'Paid'}</span>
                    
                    <img src={assets.cross_icon} alt=""
                    className='cursor-pointer' 
                    onClick={()=>handleLecture('remove',chapter.chapterId,lectureIndex)}/>

                  </div>
              ))}

              <div className='inline-flex bg-gray-100 p-2 
              rounded cursor-pointer mt-2' onClick={()=>
              handleLecture('add',chapter.chapterId)}>
                + Add Lecture</div>

              </div>
           )}
        </div>
        ))}
        <div className='flex justify-center items-center 
        bg-blue-100 p-2 rounded-lg cursor-pointer' onClick=
        {()=>handleChapter('add')}>+ Add Chapter</div>

        {showPopup&& (
          <div className='fixed inset-0 flex items-center 
          justify-center bg-gray-800 bg-opacity-50'>

          <div className='bg-white text-gray-700 
          p-4 rounded relative w-full max-w-80'>

            <h2 className='text-lg font-semibold 
            mb-4'>Add Lecture</h2>
            
            <div className='mb-2'>

            <p>Lecture Title</p>

            <input type='text'
            className='mt-1 block w-full border rounded py-1 px-2'
            value={lectureDetails.lectureTitle}
            onChange={(e)=>setLectureDetails
            ({...lectureDetails,lectureTitle:e.target.value})}/>
           
            </div>

             <div className='mb-2'>

            <p>Lecture Duration</p>

            <input type='number'
            className='mt-1 block w-full border rounded py-1 px-2'
            value={lectureDetails.lectureDuration}
            onChange={(e)=>setLectureDetails
            ({...lectureDetails,lectureDuration:e.target.value})}/>
           
            </div>

             <div className='mb-2'>

            <p>Lecture URL</p>

            <input type='text'
            className='mt-1 block w-full border rounded py-1 px-2'
            value={lectureDetails.lectureUrl}
            onChange={(e)=>setLectureDetails
            ({...lectureDetails,lectureUrl:e.target.value})}/>
           
            </div>

             <div className='mb-2 flex gap-2'>

            <p>Is preview Free?</p>

            <input type="checkbox"
            className='mt-1 scale-125'
            checked={lectureDetails.isPreviewFree}
            onChange={(e)=>setLectureDetails
            ({...lectureDetails,isPreviewFree:e.target.checked})}/>
           
            </div>

            <button type='button' className='w-full bg-blue-400 
            text-white px-4 py-2 rounded' onClick={addLecture}>Add</button>

            <img onClick={()=>setShowPopup(false)} src={assets.cross_icon}
            className='absolute top-4 right-4 w-4 cursor-pointer' alt=""/>

            </div>
            </div>
        )}
     </div>
    <button type='submit' className='bg-black text-white
     w-max py-2.5 px-8 rounded my-4'>ADD</button>



</form>


     
    </div>
  )
}

export default AddCourse
