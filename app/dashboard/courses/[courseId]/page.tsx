import CourseDetails from '@/app/components/CourseDetails';
import CreateCourseContent from '@/app/components/CreateCourseContent';
import React from 'react';


interface Params {
  courseId: string;
}

const CourseDetailsPage = ({ params }: { params: Params }) => {
  const randomImageUrl = `https://picsum.photos/1500/140?random=${Math.floor(
    Math.random() * 1000
  )}`;

  return (
    <>

    <div className='mb-6'> {/* Add margin-bottom here */}
        <figure className="relative"> 
            <img src={randomImageUrl} alt="Class Image" className="w-full h-auto" />
            <div className="absolute bottom-5 font-bold left-5 text-black bg-white p-2 rounded-md">
                <h2 className="text-2xl">{`Class Name: ${params.courseId}`}</h2>
                <p>this is the section</p>
            </div>
        </figure>  
    </div>


    
   

    <CreateCourseContent />

      <CourseDetails
              name="Course Title"
              imageSrc="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              date="Created 2025 Jan 12"
              description="# Sample Markdown **Text Formatting**: Bold,"
            />
   

    </>
  );
};

export default CourseDetailsPage;
