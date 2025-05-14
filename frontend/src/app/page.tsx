'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { loginApi } from '@/service/productService';

type LoginFormInputs = {
  userName: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('userName', data.userName);
      formData.append('password', data.password);

      const response = await loginApi(formData)

      const token = response.data?.Data?.Token;

      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }

        toast.success('Welcome back! Redirecting...', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'colored'
        });

        setTimeout(() => {
          router.push('/home');
        }, 1500);
      } else {
        toast.error('Authentication failed. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
      }
    } catch (error: any) {
      const message =
        error.response?.data?.title ||
        'Invalid credentials. Please check your username and password.';
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4">
      <div className="relative z-10 w-full max-w-md">
        <div
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-center relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity duration-500 ${
                isHovered ? 'opacity-20' : ''
              }`}
            />
            <h1 className="text-3xl font-bold text-white relative z-10">Welcome Back</h1>
            <p className="text-white/90 mt-2 relative z-10">Sign in to your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Username</label>
                <input
                  type="text"
                  {...register('userName', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Minimum 3 characters' }
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter your username"
                />
                {errors.userName && (
                  <p className="text-pink-400 text-xs mt-1 animate-fadeIn">{errors.userName.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 3, message: 'Minimum 3 characters' }
                    })}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-white/70 hover:text-white"
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-pink-400 text-xs mt-1 animate-fadeIn">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 inline-block text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                          5.291A7.962 7.962 0 014 12H0c0 3.042 
                          1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
