'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

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
          <Link href={`/dashboard/profile/${session.user?.id}`}>
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
              <img alt="User Avatar" src={session.user?.profile_picture_url || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'} />
              </div>
            </div>
          </Link>
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
