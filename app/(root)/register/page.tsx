'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter for navigation after successful form submission

interface FormData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  contact_number: string;
  role: string;
  email: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    contact_number: '',
    role: 'Educator', // Default role is Educator
    email: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();  // Initialize router for redirection

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'username') {
      setFormData((prevData) => ({
        ...prevData,
        email: `${e.target.value}@cvsu.edu.ph`
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/login');  // Redirect to login page after successful registration
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Something went wrong!'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error: Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-full">
      <div className="hero-content flex-col">
        <div className="text-center mb-4 mt-10">
          <h2 className="text-5xl font-semibold">Register</h2>
        </div>

        <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            {/* Username and Password Side by Side */}
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
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
