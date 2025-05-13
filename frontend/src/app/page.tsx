'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation'; 
import 'react-toastify/dist/ReactToastify.css';

type LoginFormInputs = {
  userName: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      console.log(data);
  
      const formData = new FormData();
      formData.append('userName', data.userName);
      formData.append('password', data.password);
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL}/api/Auth/GetAccess`,
        formData
      );
  
      const token = response.data?.Data?.Token;
  
      if (token) {
        localStorage.setItem('token', token); // Store token in localStorage
        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 3000,
        });
  
        setTimeout(() => {
          router.push('/Home');
        }, 1000);
      } else {
        toast.error('No token received from server', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
  
    } catch (error: any) {
      console.error('Login failed:', error);
  
      const message =
        error.response?.data?.title || 'Authentication failed';
  
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-700">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">Welcome Back!</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Username</label>
            <input
              type="text"
              {...register('userName', { required: 'Username is required' })}
              className="w-full px-4 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
              placeholder="Enter your username"
            />
            {errors.userName && <p className="text-red-600 text-sm mt-1">{errors.userName.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-3 text-gray-600 cursor-pointer"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <a href="/signup" className="text-purple-700 font-medium hover:underline">Sign up</a>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
