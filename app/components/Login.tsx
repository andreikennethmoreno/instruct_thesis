"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginProps {
  defaultRole?: string; // Optional prop to set a default role
}

const Login: React.FC<LoginProps> = ({ defaultRole = "Educator" }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>(defaultRole);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      // Handle error (e.g., show an error message)
      console.error(res.error);
    } else {
      // Redirect based on the user role after successful login
      if (role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard/courses");
      }
    }
  };

  return (
    <div className="hero bg-base-200 min-h-full">
      <div className="hero-content flex-col">
 

       
        {/* Conditionally render the role-based label */}
        {role === "Admin" && (
          <div className="text-center mb-4 mt-10">
          <h2 className="text-5xl font-semibold">Login as Admin</h2>
          </div>
        )}
        {role !== "Admin" && (
            <div className="text-center mb-4 mt-10">
            <h2 className="text-5xl font-semibold">Login</h2>
          </div>
        )}


        <div className="card bg-base-100 w-full shrink-0 shadow-2xl">

        

          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Hidden Input for Role with Default Value */}
            <input
              type="hidden"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
