import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const { currentUser, logout } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-white transition-colors duration-300 transform hover:text-gray-300">
                        PING
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:mx-6">
                    <Link
                        to="/"
                        className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                    >
                        Home
                    </Link>

                    {currentUser ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-red-500 md:mx-4 md:my-0 text-left md:text-center"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
