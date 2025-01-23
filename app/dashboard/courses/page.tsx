"use client";

import { useSession } from "next-auth/react";
import ClassCard from '@/app/components/CourseCard';
import CourseForm from '@/app/components/CourseForm';
import Modal from '@/app/components/Modal';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Course: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id; // Get the user ID from session
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch courses from API
  const fetchCourses = async () => {
    if (!userId) return; // If no user ID, exit early

    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Error fetching courses');
    } finally {
      setIsLoading(false);
    }
  };

  // UseEffect to fetch courses when component mounts or when userId changes
  useEffect(() => {
    fetchCourses();
  }, [userId]); // Re-run the effect when userId changes

  // Open Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle course submission
  const handleCourseSubmit = async (formData: {
    course_code: string;
    title: string;
    description: string;
    prerequisites: string;
    learning_outcomes: string;
    course_picture_url: string;
  }) => {
    console.log("Submitted course data:", formData);
    console.log(userId + "is the owner")
    
    setIsLoading(true); // Show loading spinner or indication
    
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          owners: [parseInt(userId)], // Assuming the logged-in user is the owner of the course
        }),
      });
      console.log("Submitting course data:", {
        ...formData,
        owners: [userId],
      });


  
      if (!response.ok) {
        throw new Error("Failed to create the course");
      }
  
      const newCourse = await response.json();
      console.log("Course created successfully:", newCourse);
      
      // Re-fetch the courses to update the list
      fetchCourses();
  
      closeModal(); // Close modal after successful submission
    } catch (error) {
      console.error("Error creating course:", error);
      setError("Failed to create course");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load courses: {error}</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {courses.length > 0 ? (
          courses.map((course: any) => (
            <Link
              href={`/dashboard/courses/${course.course_id}`}
              key={course.course_id}
            >
              <ClassCard
                course_picture_url={course.course_picture_url}
                course_code={course.course_code}
                className={course.title}
                section={course.section || "No section available"}
                instructorName={course.owners[0]?.email || "Unknown"}
              />
            </Link>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      <button
        onClick={openModal}
        className="btn fixed bottom-5 right-5 btn-primary"
      >
        Add Course
      </button>

      <Modal title="Add Course" isOpen={isModalOpen} onClose={closeModal}>
        <CourseForm onSubmit={handleCourseSubmit} isLoading={isLoading} />
      </Modal>
    </>
  );
};

export default Course;
