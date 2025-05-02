import React from 'react';
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-400">Login to Your Account</h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center">
          <span className="text-gray-400">OR</span>
        </div>

        <button
          className="flex items-center justify-center w-full bg-white text-gray-900 py-2 rounded-lg shadow hover:shadow-md transition"
        >
          <FaGoogle  className="mr-2 text-xl" />
          Login with Gmail
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
