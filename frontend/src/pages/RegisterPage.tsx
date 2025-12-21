import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [successful, setSuccessful] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const { register } = useContext(AuthContext)!;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);

        try {
            await register(username, email, password);
            setMessage("User registered successfully! Please login.");
            setSuccessful(true);
        } catch (error: any) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            setMessage(resMessage);
            setSuccessful(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    {!successful && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 mt-2 text-white bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 mt-2 text-white bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 mt-2 text-white bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {message && (
                        <div
                            className={`p-3 text-sm rounded-lg ${successful ? "text-green-400 bg-green-900/30 border border-green-800" : "text-red-400 bg-red-900/30 border border-red-800"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    {!successful && (
                        <button
                            type="submit"
                            className="w-full py-3 text-white bg-gradient-to-r from-teal-500 to-teal-400 rounded-lg hover:from-teal-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-semibold transition transform hover:scale-[1.02]"
                        >
                            Sign Up
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
