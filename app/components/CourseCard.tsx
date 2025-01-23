import React from 'react';

interface CourseCardProps {
  className: string;
  section: string;
  instructorName: string;
  course_picture_url: string;
  course_code: string;
}

const CourseCard: React.FC<CourseCardProps> = ({course_code, className, section, instructorName, course_picture_url }) => {

  return (
    <div className="card bg-base-100 w-72 shadow-xl">
      <figure>
      <img
  src={course_picture_url || "https://i.pinimg.com/736x/73/19/8c/73198c5531a4fa6c4aa49de2fce873a1.jpg"}
  alt={`${className} illustration`}
  style={{
    objectFit: 'cover',    // Ensures the image covers the area and maintains aspect ratio
    objectPosition: 'center', // Ensures the image is centered
    width: '400px',         // Make the width 100% of its parent container
    height: '100px',       // Set the height to 400px or adjust as needed
  }}
/>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{className}</h2>
        <p>Section: {section}</p>
        <p>Instructor: {instructorName}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-sm btn-primary">Details</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
