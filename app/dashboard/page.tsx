"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /courses
    router.push('dashboard/courses');
  }, [router]);

  return (
    <h1>Redirecting to /courses...</h1>
  );
};

export default Dashboard;
