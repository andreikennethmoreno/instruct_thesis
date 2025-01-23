'use client';

import useRandomProfilePicture from '@/lib/randomPicture';
import { useState } from 'react';

interface CourseFormData {
  course_code: string;
  title: string;
  description: string;
  prerequisites?: string;
  learning_outcomes?: string;
  course_picture_url?: string;
}

interface CourseFormProps {
  initialFormData?: CourseFormData;
  onSubmit: (data: CourseFormData) => Promise<void>;
  isLoading: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialFormData, onSubmit, isLoading }) => {
  const coursePictureUrl = useRandomProfilePicture(1500, 140);
  
  
  const [formData, setFormData] = useState<CourseFormData>({
    course_code: initialFormData?.course_code || '',
    title: initialFormData?.title || '',
    description: initialFormData?.description || '',
    prerequisites: initialFormData?.prerequisites || '',
    learning_outcomes: initialFormData?.learning_outcomes || '',
    course_picture_url: initialFormData?.course_picture_url || coursePictureUrl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="card-body" onSubmit={handleFormSubmit}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Course Code</span>
        </label>
        <input
          type="text"
          name="course_code"
          placeholder="Course Code"
          className="input input-bordered"
          value={formData.course_code}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input input-bordered"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Prerequisites</span>
        </label>
        <textarea
          name="prerequisites"
          placeholder="Prerequisites"
          className="textarea textarea-bordered"
          value={formData.prerequisites}
          onChange={handleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Learning Outcomes</span>
        </label>
        <textarea
          name="learning_outcomes"
          placeholder="Learning Outcomes"
          className="textarea textarea-bordered"
          value={formData.learning_outcomes}
          onChange={handleChange}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Course Picture URL</span>
        </label>
        <input
          type="text"
          name="course_picture_url"
          placeholder="Course Picture URL"
          className="input input-bordered"
          value={formData.course_picture_url}
          onChange={handleChange}
        />
      </div>

      <div className="form-control mt-6">
        <button className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
