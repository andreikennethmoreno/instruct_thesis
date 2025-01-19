import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface CourseDetailsProps {
  name: string;
  imageSrc: string;
  date: string;
  description: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ name, imageSrc, date, description }) => {
  return (
    <div className="m-5 border card bg-base-100 shadow-xl mt-6">
      <div className="card-body">
        <div className='flex items-center space-x-4'>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="rounded-full">
              <img
                alt="Course Image"
                src={imageSrc}
              />
            </div>
          </div>

          <div>
            <h3 className='text-md font-bold'>{name}</h3>
            <p className='text-sm'>{date}</p>
          </div>
        </div>

          
        <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>


        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
