'use client';

import React, { useState, useEffect } from "react";
import { hashPassword } from "@/lib/bcrypt";
import LogoutButton from "@/app/components/Logout";
import RegisterForm from "@/app/components/RegisterForm";
import Modal from "@/app/components/Modal";

interface User {
  user_id: number;
  email: string;
  username: string;
  password?: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  contact_number: string | null;
  profile_picture_url: string | null;
  joined_date: string;
}

interface ProfileDetailsPageClientProps {
  user: User;
}

const ProfileDetailsPageClient: React.FC<ProfileDetailsPageClientProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>(user);

  useEffect(() => {
    // Update state when the user prop changes (for real-time updates)
    setSelectedUser(user);
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData: User) => {
    setIsLoading(true);
    try {
      // Handle password logic
      if (formData.password && !formData.password.startsWith("$2a$")) {
        formData.password = await hashPassword(formData.password);
      }

      // Send PUT request to update user profile
      const response = await fetch(`/api/users/${formData.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update the selected user state
        setSelectedUser(updatedUser);

        alert("Profile updated successfully");
        closeModal();
      } else {
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

  return (
    <div className="flex w-full">
      <div className="card bg-base-100 my-4 ml-3 border rounded-box grid w-1/5 flex-grow place-items-center">
        <div className="p-5">
          <div className="avatar">
            <div className="w-52 rounded-full">
              <img src={selectedUser.profile_picture_url || ""} alt="User Avatar" />
            </div>
            <button className="btn btn-sm rounded-full btn-primary" onClick={openModal}>
              Edit
            </button>
          </div>
          <h3 className="pt-5 font-bold text-2xl">
            {selectedUser.first_name} {selectedUser.last_name}
          </h3>
          <h4 className="text-xl">@{selectedUser.username}</h4>
          <div className="badge badge-primary">{selectedUser.role}</div>
          <ul className="pt-5">
            <li className="text-md">
              <span className="font-bold">Contact:</span> {selectedUser.contact_number}
            </li>
            <li className="text-md">
              <span className="font-bold">Email:</span> {selectedUser.email}
            </li>
            <li className="text-md">
              <span className="font-bold">Joined:</span> {selectedUser.joined_date}
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 my-4 ml-3 border rounded-box grid w-2/3 flex-grow">
        <div className="m-6">
          <div className="grid gap-4">
            <div className="card bg-base-100 w-full shadow-xl border rounded-box">
              <div className="card-body">
                <p>name of the course</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Edit Profile" isOpen={isModalOpen} onClose={closeModal}>
        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialFormData={selectedUser}
        />
      </Modal>
    </div>
  );
};

export default ProfileDetailsPageClient;
