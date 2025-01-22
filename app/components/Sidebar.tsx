'use client';

import React from 'react';
import { useSession } from 'next-auth/react'; // Import useSession to get session data
import Link from 'next/link'; // Import Link for routing

const Sidebar = () => {
  const { data: session } = useSession(); // Get session data

  // Check if user is logged in and has a valid session
  if (!session) {
    return null; // If there's no session, return nothing or a loading state
  }

  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="border menu bg-base-100 text-base-content min-h-full w-40 p-4">
          {/* Sidebar content with Link components for routing */}
         
          <li>
            <Link href={`/dashboard/profile/${session.user?.id}`}>
                <div className='font-bold text-md'>Profile</div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/courses">
                <div className='font-bold text-md'>Courses</div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/messages">
                <div className='font-bold text-md'>Messages</div>
            </Link>
          </li>

        

          {/* Conditionally render Sidebar Item 2 based on role */}
          {session.user?.role === 'Admin' && (
            <li>
              <Link href="/dashboard/admin/users">
                <div className='font-bold text-md'>Users</div>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
