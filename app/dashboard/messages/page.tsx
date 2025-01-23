"use client";

import { useEffect, useState } from 'react';
import ChatBox from '@/app/components/ChatBox';

interface User {
  user_id: number;
  username: string;
  profile_picture_url: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Messages() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users'); // Replace with your actual API endpoint
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user); // Set the clicked user as selected
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex">
        {/* Sidebar takes up 1/4th of the width */}
        <div className="w-1/4">
          <div className="drawer sticky top-0 z-60 drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
              {/* Page content here */}
              <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                Open drawer
              </label>
            </div>
            <div className="drawer-side">
              <ul className="border menu bg-base-100 text-base-content min-h-full">
                <label className="input input-bordered flex items-center m-3 ">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </label>

                {/* Render filtered users */}
                {filteredUsers.map((user) => (
                  <li
                    key={user.user_id}
                    className="flex items-center justify-between space-x-4 w-full px-3"
                    onClick={() => handleUserClick(user)} // Attach the click handler
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <div className="avatar">
                        <div className="w-11 rounded-full">
                          <img
                            src={user.profile_picture_url || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt="Avatar"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <h3 className="text-lg font-medium">{user.first_name} {user.last_name}</h3>
                        <p className="text-sm text-gray-500">Last message preview</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Content area (chat) takes up the remaining 3/4th of the width */}
        <div className="flex-1 flex flex-col">
          <ChatBox selectedUser={selectedUser} /> {/* Pass selected user to ChatBox */}
        </div>
      </div>
    </>
  );
}
