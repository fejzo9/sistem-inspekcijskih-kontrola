import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
    const { currentUser } = useContext(AuthContext)!;

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700 max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    Dashboard
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Welcome back, <span className="text-blue-400 font-bold">{currentUser.username}</span>!
                </p>

                <div className="bg-gray-900 rounded-xl p-6 text-left">
                    <h3 className="text-lg font-semibold text-teal-400 mb-4">Your Profile Details</h3>
                    <p className="text-gray-400 mb-2"><strong className="text-gray-300">ID:</strong> {currentUser.id}</p>
                    <p className="text-gray-400 mb-2"><strong className="text-gray-300">Email:</strong> {currentUser.email}</p>
                    <p className="text-gray-400"><strong className="text-gray-300">Roles:</strong> {currentUser.roles && currentUser.roles.join(", ")}</p>
                </div>

                <div className="mt-8">
                    <p className="text-sm text-gray-500 italic">This is a protected page. Only authenticated users can see this.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
