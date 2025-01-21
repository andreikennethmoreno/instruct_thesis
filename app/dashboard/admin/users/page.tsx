'use client';

import Modal from "@/app/components/Modal";
import RegisterForm from "@/app/components/RegisterForm";
import { hashPassword } from "@/lib/bcrypt";
import React, { useState, useEffect } from "react";

interface User {
  user_id: number;
  email: string;
  username: string;
  password?: string;
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

  // Open modal for editing or adding a user
  const openModal = (user: User | null) => {
    setSelectedUser(user);  // Set the selected user for editing, or null for creating a new user
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);  // Clear selected user when closing modal
  };

  const handleSubmit = async (formData: User) => {
    setIsLoading(true);
    try {
      let response;
  
      console.log("Submitting user with ID:", formData.user_id); // Debugging info
  
      // Handle password logic
      if (formData.password && !formData.password.startsWith("$2a$")) {
        // Hash the password only if it's plaintext
        const hashedPassword = await hashPassword(formData.password);
        formData.password = hashedPassword;
      } else if (!formData.password && formData.user_id) {
        // Fetch and retain the existing hashed password if no password is provided
        const existingUserResponse = await fetch(`/api/users/${formData.user_id}`);
        if (!existingUserResponse.ok) {
          throw new Error("Failed to fetch existing user data.");
        }
        const existingUserData = await existingUserResponse.json();
        formData.password = existingUserData.password; // Use the existing hashed password
      }
  
      // Send PUT request to update user profile
      response = await fetch(`/api/users/${formData.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response && response.ok) {
        const data = await response.json();
        setSelectedUser(data); // Update local state
        alert("Profile updated successfully");
        closeModal();
      } else if (response) {
        const errorMessage = await response.text();
        alert(`Failed to update profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: Could not connect to the server");
    } finally {
      setIsLoading(false);
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
        <div className="flex items-center ">
        <h1 className="text-5xl">List of Users</h1>
        <button
          className="btn btn-sm btn-primary rounded-full ml-4"
          onClick={() => openModal(null)} // Pass `null` to indicate new user
        >
          Add
        </button>
        </div>
        

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
        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialFormData={selectedUser || {
            user_id: 0,
            email: "",
            username: "",
            password: "",
            first_name: "",
            last_name: "",
            role: "",
            contact_number: ""
          }} // Pass empty data for new user
        />
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
