'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation after successful form submission
import RegisterForm from '@/app/components/RegisterForm';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: { [key: string]: any }) => {
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
        router.push('/login'); // Redirect to login page after successful registration
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
          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
