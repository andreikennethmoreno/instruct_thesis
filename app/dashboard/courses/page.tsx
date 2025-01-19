import ClassCard from '@/app/components/CourseCard';
import Link from 'next/link';

import React from 'react';

const Course: React.FC = () => {
  const courses = [
    { id: '1', className: 'Mathematics 101', section: 'A', instructorName: 'John Doe' },
    { id: '2', className: 'Physics 202', section: 'B', instructorName: 'Jane Smith' },
    { id: '3', className: 'Chemistry 303', section: 'C', instructorName: 'Alice Johnson' },
    { id: '4', className: 'Biology 404', section: 'D', instructorName: 'Emma Brown' },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-4">
      {courses.map((courseInfo) => (
        <Link href={`/dashboard/courses/${courseInfo.id}`} key={courseInfo.id}>
            <ClassCard
              className={courseInfo.className}
              section={courseInfo.section}
              instructorName={courseInfo.instructorName}
            />
        </Link>
      ))}
    </div>
    </>
  );
};

export default Course;
