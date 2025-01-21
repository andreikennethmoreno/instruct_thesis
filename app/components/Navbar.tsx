'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LogoutButton from './Logout';
import Logout from './Logout';

const Navbar = () => {
  const { data: session, status } = useSession(); // Fetch session from NextAuth
  

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="navbar sticky top-0 z-50 bg-base-100 border">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Loading...</a>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 border">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        {session ? (
          <Logout />
         
        ) : (
          <Link href="/login">
            <button className="btn btn-ghost">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
