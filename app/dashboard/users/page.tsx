"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  contact_number: string;

}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load users: {error}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between m-5">
        <h1 className="text-5xl">List of Users</h1>
        <div>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="table">
        {/* Head */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Name</th>
            <th>Contact Info</th>
            <th>role</th>
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover">
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.last_name}, {user.first_name}</td>
              <td>{user.contact_number}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
