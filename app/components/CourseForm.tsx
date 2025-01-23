'use client';

import useRandomProfilePicture from '@/lib/randomPicture';
import { useEffect, useState } from 'react';

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
  type: string | null;

}

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialFormData, onSubmit, isLoading, type }) => {
  const coursePictureUrl = useRandomProfilePicture(1500, 140);
  
  
  const [formData, setFormData] = useState<CourseFormData>({
    course_code: initialFormData?.course_code || '',
    title: initialFormData?.title || '',
    description: initialFormData?.description || '',
    prerequisites: initialFormData?.prerequisites || '',
    learning_outcomes: initialFormData?.learning_outcomes || '',
    course_picture_url: initialFormData?.course_picture_url || coursePictureUrl,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');  // for search functionality


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

  useEffect(() => {
    // Fetch users from the API route
    const fetchUsers = async () => {
      const queryParam = searchQuery ? `?q=${searchQuery}` : ''; // Add search query if present
      const response = await fetch(`/api/users${queryParam}`);
      const data = await response.json();
  
      // Filter users based on the selected role (type)
      if (type) {
        const filteredUsers = data.filter((user: User) => user.role.toLowerCase() === type.toLowerCase());
        setUsers(filteredUsers);
      } else {
        setUsers(data); // Set all users if no type is selected
      }
    };
  
    fetchUsers();
  }, [searchQuery, type]);

  return (
    <form className="card-body" onSubmit={handleFormSubmit}>
  {/* If type is set, render only the dropdown */}
  {type && type !== "" ? (
      <div className="form-control">
        <label className="label">
          <span className="label-text">Select {type === 'Students' ? 'Student' : 'Educators'}</span>
        </label>
        <select name="type_selection" className="select select-bordered">
          <option value="">Choose {type}</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))
          ) : (
            <option value="">No users found</option>
          )}
        </select>
      </div>
    ) : (
    <>
      {/* Render full form except the dropdown if type is not provided */}
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

      
    </>
  )}

<div className="form-control mt-6">
        <button className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
</form>

  );
};

export default CourseForm;
