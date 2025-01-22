"use client"

import ClassCard from '@/app/components/CourseCard';
import Modal from '@/app/components/Modal';
import Link from 'next/link';
import React, { useState } from 'react';

const Course: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Set initial loading state to false for simplicity
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courses = [
    { id: '1', className: 'Mathematics 101', section: 'A', instructorName: 'John Doe' },
    { id: '2', className: 'Physics 202', section: 'B', instructorName: 'Jane Smith' },
    { id: '3', className: 'Chemistry 303', section: 'C', instructorName: 'Alice Johnson' },
    { id: '4', className: 'Biology 404', section: 'D', instructorName: 'Emma Brown' },
  ];

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load users: {error}</p>;
  }

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

      {/* Modal */}
      <Modal title="Edit Course" isOpen={isModalOpen} onClose={closeModal}>
        <h1>This is the Course form</h1>
        {/* Add your form fields here */}
      </Modal>

      {/* Button to open modal */}
      <button
        onClick={openModal}
        className="btn fixed bottom-5 right-5 btn-primary"
      >
        Add Course
      </button>
    </>
  );
};

export default Course;
