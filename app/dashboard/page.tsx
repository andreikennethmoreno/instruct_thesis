import React from 'react';
// import { useRouter } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../pages/api/auth/[...nextauth]';

const Dashboard: React.FC = async () => {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
  // const router = useRouter();

  // useEffect(() => {
  //   // Redirect to /courses
  //   router.push('dashboard/courses');
  // }, [router]);

  return (
    <div>
      <h1>Redirecting to login...</h1>
      <p>If you are not redirected, <a href="/login">click here</a>.</p>
    </div>
  );
}

return (
  <div>
    <h1>Admin Dashboard</h1>
    <p>Welcome to the Admin Dashboard, {session.user.email}!</p>
  </div>
);
};

export default Dashboard;
