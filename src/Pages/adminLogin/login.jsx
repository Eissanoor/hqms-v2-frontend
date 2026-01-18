import React from 'react';
import { FaBriefcase, FaClock, FaHandsHelping, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from "../../Images/HD GST LOGO.png";
import '../../index.css';

const Login = () => {
    const navigate = useNavigate();

    const systemCards = [
        {
            id: "patient",
            title: "Queue Management System for Patient",
            subtitle: "Patient Check-in & Flow",
            icon: <FaUsers className="text-2xl text-green-600" />,
            metaIcon: <FaClock className="text-lg text-gray-400" />,
            metaText: "Real-time Queue Visibility",
            cta: "View system",
            link: "https://hqms.gtrack.online/"
        },
        {
            id: "hr",
            title: "Queue Management System for HR Employee Request",
            subtitle: "Leave & Claims • Onboarding & Support Tickets",
            icon: <FaBriefcase className="text-2xl text-green-600" />,
            metaIcon: <FaHandsHelping className="text-lg text-gray-400" />,
            metaText: "HR Assistance Center",
            cta: "Submit HR Request",
            link: "https://qmshr.gstsa1.org/"
        }
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Main content area */}
            <div className="flex-1 flex flex-col items-center py-10 px-4 sm:px-8">
                {/* Logo at the top */}
                <div className="mb-8">
                    <img
                        src={logo}
                        alt="GST logo"
                        className="w-full max-w-[220px] h-auto mx-auto object-contain"
                    />
                </div>

                {/* Cards container */}
                <div className="w-full max-w-xl space-y-7">
                    {systemCards.map((card) => (
                        <div
                            key={card.id}
                            className="rounded-3xl bg-white shadow-lg px-6 sm:px-8 py-8 flex flex-col gap-4 border border-gray-100"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                            {card.title}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {card.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                                    {card.metaIcon}
                                    <span>{card.metaText}</span>
                                </div>
                            </div>
                            <a
                                href={card.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                {card.cta}
                            </a>
                        </div>
                    ))}
                </div>

                <footer className="mt-6 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} Queue Management System. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Login;
