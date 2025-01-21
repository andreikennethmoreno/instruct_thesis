// components/Logout.tsx
"use client"; // Indicate this is a client-side component

import { signOut } from "next-auth/react";

const Logout: React.FC = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); // Redirect to the login page after logout
  };

  return (
    <button
      className="text-red-600 text-sm font-bold"
      onClick={handleLogout} // Call the logout handler when the button is clicked
    >
      Log out
    </button>
  );
};

export default Logout;
