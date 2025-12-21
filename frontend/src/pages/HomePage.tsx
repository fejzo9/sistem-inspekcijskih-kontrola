import React from "react";

const HomePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <header className="mb-12">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-6">
                    Full Stack Auth App
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    A secure and modern application demonstrating Spring Boot backend with JWT authentication and a React + Tailwind frontend.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="p-8 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition duration-300">
                    <h2 className="text-2xl font-bold text-white mb-4">Secure Backend</h2>
                    <p className="text-gray-400">
                        Powered by Java Spring Boot 3+ with Spring Security and PostgreSQL database.
                    </p>
                </div>
                <div className="p-8 rounded-xl bg-gray-800 border border-gray-700 hover:border-teal-400 transition duration-300">
                    <h2 className="text-2xl font-bold text-white mb-4">Modern Frontend</h2>
                    <p className="text-gray-400">
                        Built with React, TypeScript, and styled with Tailwind CSS for a premium look.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
