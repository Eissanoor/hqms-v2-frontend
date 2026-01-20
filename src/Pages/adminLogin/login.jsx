import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import logo from "../../Images/HD GST LOGO.png";
import '../../index.css';
import { baseUrl } from '../../utils/config';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/v1/user/login`, {
                email: formData.email,
                password: formData.password
            });

            // Handle successful login
            if (response.data && response.data.success) {
                const { data } = response.data;
                
                // Store tokens and user data in localStorage
                localStorage.setItem('accessToken', data.user.accessToken);
                localStorage.setItem('refreshToken', data.user.refreshToken);
                localStorage.setItem('userdata', JSON.stringify(data));
                
                toast.success(`Welcome back, ${data.user.name}!`, {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: '500',
                    },
                    icon: '👋',
                });

                // Navigate to home page
                setTimeout(() => {
                    navigate('/Home');
                    window.location.reload(); // Reload to fetch user roles
                }, 1000);
            }
        } catch (error) {
            // Handle login errors
            const errorMessage = error.response?.data?.message 
                || error.response?.data?.error 
                || 'Login failed. Please check your credentials and try again.';
            
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    fontWeight: '500',
                },
                icon: '❌',
            });
            
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
            {/* Main content area */}
            <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-8">
                {/* Login Card */}
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <img
                            src={logo}
                            alt="GST logo"
                            className="w-full max-w-[200px] h-auto mx-auto object-contain mb-4"
                        />
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <FaUserShield className="text-2xl text-green-600" />
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Admin Login
                            </h1>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Queue Management System
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="rounded-3xl bg-white shadow-2xl px-6 sm:px-10 py-10 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className={`text-lg ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="user@example.com"
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            errors.email 
                                                ? 'border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                        }`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span>⚠</span> {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className={`text-lg ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            errors.password 
                                                ? 'border-red-500 focus:ring-red-200' 
                                                : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                                        }`}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="text-lg" />
                                        ) : (
                                            <FaEye className="text-lg" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span>⚠</span> {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-sm text-gray-600">
                                Secure access to Queue Management System
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} Queue Management System. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Login;
