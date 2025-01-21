'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation after successful form submission

interface FormData {
  user_id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  role: string;
  email: string;
  profile_picture_url: string;
}

interface RegisterFormProps {
  initialFormData?: FormData; // Optional initial form data
  onSubmit: (data: FormData) => Promise<void>; // Custom onSubmit handler to be passed from parent
  isLoading: boolean; // Prop to control loading state
}

const RegisterForm: React.FC<RegisterFormProps> = ({ initialFormData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    user_id: initialFormData?.user_id || 0,
    username: initialFormData?.username || '',
    password: initialFormData?.password || '',
    first_name: initialFormData?.first_name || '',
    last_name: initialFormData?.last_name || '',
    contact_number: initialFormData?.contact_number || '',
    role: initialFormData?.role || 'Educator', // Default role is Educator
    email: initialFormData?.email || '',
    profile_picture_url: initialFormData?.profile_picture_url || 'https://i.pinimg.com/736x/56/61/34/5661345ba5f329555626d58f33dd642c.jpg',
  });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: e.target.value,
      }));
  
      // If the username changes, update the email as well
      if (e.target.name === 'username') {
        setFormData((prevData) => ({
          ...prevData,
          email: `${e.target.value}@cvsu.edu.ph`,
        }));
      }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault(); 
      onSubmit(formData); 
    };
  
  
    return (
      <form className="card-body" onSubmit={handleFormSubmit}>

<div className="form-control">
            <label className="label">
              <span className="label-text">Profile Picture</span>
            </label>
            <input
              type="text"
              name="profile_picture_url"
              placeholder="profile_picture_url"
              className="input input-bordered"
              required
              value={formData.profile_picture_url}
              onChange={handleChange}
            />
           
          </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
  
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
  
        {/* First Name and Last Name Side by Side */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="input input-bordered"
              required
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
  
          <div className="form-control">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="input input-bordered"
              required
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
  
        {/* Contact Number and Auto-Generated Email Side by Side */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="text"
              name="contact_number"
              placeholder="Contact Number"
              className="input input-bordered"
              value={formData.contact_number}
              onChange={handleChange}
            />
          </div>
  
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="input input-bordered"
              value={formData.email}
              readOnly
            />
          </div>
        </div>
  
        {/* Hidden Input for Role with Default Value */}
        <input type="hidden" name="role" value={formData.role} />
  
        <div className="form-control mt-6">
          <button className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Saving' : 'Save'}
          </button>
        </div>
      </form>
    );
  };
  
export default RegisterForm;
