import React from 'react';

interface CourseCardProps {
  className: string;
  section: string;
  instructorName: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ className, section, instructorName }) => {
  const randomImageUrl = `https://picsum.photos/400/100?random=${Math.floor(
    Math.random() * 1000
  )}`;

  return (
    <div className="card bg-base-100 w-72 shadow-xl">
      <figure>
        <img src={randomImageUrl} alt={`${className} illustration`} />
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
