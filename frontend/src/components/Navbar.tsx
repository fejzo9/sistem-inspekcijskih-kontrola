import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {

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
                        className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-emerald-400 md:mx-4 md:my-0"
                    >
                        Proizvodi
                    </Link>
                    <Link
                        to="/inspekcijska-tijela"
                        className="my-2 text-gray-200 transition-colors duration-300 transform hover:text-emerald-400 md:mx-4 md:my-0"
                    >
                        Inspekcijska Tijela
                    </Link>
                    <span className="my-2 text-gray-500 cursor-not-allowed md:mx-4 md:my-0" title="Uskoro">
                        Kontrole
                    </span>

                    {/* Hidden Auth for future use
                    {currentUser ? (...) : (...)}
                    */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
