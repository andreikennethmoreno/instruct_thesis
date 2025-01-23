"use client";

import CourseDetails from '@/app/components/CourseDetails';
import CreateCourseContent from '@/app/components/CreateCourseContent';
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import CourseForm from '@/app/components/CourseForm';
import Modal from '@/app/components/Modal';
import useRandomProfilePicture from '@/lib/randomPicture';

interface Params {
  courseId: string;
}

interface Course {
  course_code: string;
  title: string;
  description: string;
  prerequisites: string | null;
  learning_outcomes: string | null;
  course_picture_url: string;
  created_at: string;
  updated_at: string;
  users: any[];
  owners: any[];
}

const CourseDetailsPage = ({ params }: { params: Params }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const coursePictureUrl = useRandomProfilePicture(1500, 140);

  const openModal = (course: Course | null) => {
    setSelectedCourse(course); // Set the selected course for editing
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null); // Reset selected course when closing
  };

  const onSubmit = async (formData: Course) => {
    if (!formData) return;
    setIsLoading(true);
  
    // Fetch session data (assuming session has user information like session.user.id)
    const sessionResponse = await fetch('/api/auth/session');
    const session = await sessionResponse.json();
  
    if (!session || !session.user?.id) {
      console.error("User is not logged in or missing session data");
      setIsLoading(false);
      return;
    }
  
    // Ensure owners is an array (if missing, initialize it as an empty array)
    if (!Array.isArray(formData.owners)) {
      formData.owners = [];
    }
  
    // Ensure the current user's ID is in the owners array and is passed as a number (parse it to an integer)
    const userId = parseInt(session.user.id, 10);  // Ensure it's an integer
    
    // Only add the userId if it's not already in the array
    if (!formData.owners.includes(userId)) {
      formData.owners.push(userId);
    }
  
    // Ensure all values in owners are numbers
    formData.owners = formData.owners.map(id => parseInt(id, 10));
  
    console.log('Form submitted:', formData);
  
    try {
      // Send the updated course data to the server
      const response = await fetch(`/api/courses/${course?.course_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const updatedCourse = await response.json();
  
      if (response.ok) {
        // Update the course state with the updated data
        setCourse(updatedCourse);
        closeModal();
      } else {
        // Handle error response
        console.error('Failed to update course:', updatedCourse.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const unwrapParamsAndFetchData = async () => {
      try {
        const resolvedParams = await params; // Unwrap params
        const courseId = resolvedParams.courseId;

        // Fetch session (mocked for client-side example; adapt as needed)
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();

        if (!session || session.error) {
          notFound();
          return;
        }

        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        const courseData = await courseResponse.json();

        if (!courseData) {
          notFound();
          return;
        }

        setCourse(courseData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    unwrapParamsAndFetchData();
  }, [params]);


  const deleteCourse = async (courseId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert("Course deleted successfully.");
        // Optionally, you could redirect or refresh the course list
        window.location.href = "/dashboard/courses"; // Adjust the redirect path as needed
      } else {
        const errorData = await response.json();
        console.error('Failed to delete course:', errorData.error);
        alert(errorData.error || "Failed to delete course.");
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert("An error occurred while deleting the course.");
    }
  };
  

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-6">
        <figure className="relative">
          <img src={course.course_picture_url || coursePictureUrl } alt="Class Image" className="w-full h-auto" />
          <div className="absolute bottom-5 font-bold left-5 text-black bg-white p-2 rounded-md">
            <h2 className="text-2xl">{`${course.course_code} ${course.title}`}</h2>
            <p>Section TODO</p>
          </div>
          <div className="absolute bottom-5 font-bold right-5 z-40 text-black p-2 rounded-md">
            <div className="dropdown dropdown-left dropdown-hover">
              <div tabIndex={0} role="button" className="btn btn-primary m-1">
                Add
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li className="p-1">
                  <button onClick={() => openModal(course)} className="btn-sm btn btn-secondary">
                    Students
                  </button>
                </li>
                <li className="p-1">
                <button onClick={() => openModal(course)} className="btn-sm btn btn-error">
                  Instructors
                </button>                
              </li>
              </ul>
            </div>



            <div className="dropdown dropdown-left dropdown-hover">
              <div tabIndex={0} role="button" className="btn m-1">
                Actions
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li className="p-1">
                  <button onClick={() => openModal(course)} className="btn-sm btn btn-success">
                    Edit
                  </button>
                </li>
                <li className="p-1">
                <button onClick={() => deleteCourse(course.course_id)} className="btn-sm btn btn-error">
                  Delete
                </button>                
              </li>
              </ul>
            </div>
          </div>
        </figure>
      </div>

      <Modal title="Edit Course" isOpen={isModalOpen} onClose={closeModal}>
        <CourseForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          initialFormData={selectedCourse ? {
            ...selectedCourse,
            prerequisites: selectedCourse.prerequisites ?? '',
            learning_outcomes: selectedCourse.learning_outcomes ?? '',
          } : {
            course_code: '',
            title: '',
            description: '',
            prerequisites: '',
            learning_outcomes: '',
            course_picture_url: '',
          }}
        />
      </Modal>

      <CreateCourseContent />

      <CourseDetails
        name={course.title}
        imageSrc="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        date={`Created ${new Date(course.created_at).toLocaleDateString()}`}
        description={course.description}
      />
    </>
  );
};

export default CourseDetailsPage;
