'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify'; 

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL}/getAccess`,
        data,
        { withCredentials: true }
      );
      
      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });

      console.log('Login successful:', response.data);
     

    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Login failed:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-red-600 to-red-700">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <a href="/signup" className="text-red-600 font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
