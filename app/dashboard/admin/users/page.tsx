// UserList.tsx
'use client';

import Modal from "@/app/components/Modal";
import RegisterForm from "@/app/components/RegisterForm";
import React, { useState, useEffect } from "react";

interface User {
  user_id: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openModal = (user: User) => {
    setSelectedUser(user);  // Set the selected user for editing
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);  // Clear the selected user when closing modal
  };

  const handleSubmit = async (formData: User) => {
    setIsLoading(true);
    try {
    
  
      if (formData.user_id) {
        // Update existing user
        const response = await fetch(`/api/users/${formData.user_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.user_id === formData.user_id ? formData : user
            )
          );
          alert('User updated successfully');
        }
      } else {
        // Create new user
        const response = await fetch(`/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const newUser = await response.json();
          setUsers((prevUsers) => [...prevUsers, newUser]);
          alert('User created successfully');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error: Could not connect to the server');
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };
  

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

  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user with ID ${userId}`);
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
      alert(`User with ID ${userId} deleted successfully.`);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

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

      <Modal title="Edit User" isOpen={isModalOpen} onClose={closeModal}>
      {selectedUser && (
        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialFormData={selectedUser} // This ensures the selected user's data is passed to the form
        />
      )}
    </Modal>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Name</th>
            <th>Contact Info</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.user_id} className="hover">
              <td>{user.user_id}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.contact_number}</td>
              <td>{user.role}</td>
              <td>
                <div className="ml-auto flex justify-center space-x-4">
                  <button className="btn-success btn" onClick={() => openModal(user)}>
                    Edit
                  </button>
                  <button className="btn-error btn" onClick={() => handleDelete(user.user_id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
