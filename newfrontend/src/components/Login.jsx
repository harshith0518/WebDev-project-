import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import paths from '../paths';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegisterButtonClick = () => {
    navigate(paths.REGISTER);

  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8000/api/login/",
      {
        'email': email,
        'password': password,
      }
    );
    const { access, refresh } = response.data.tokens;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    // console.log("Access :", access);
    // console.log("Refresh :", refresh);
    const fallBack = localStorage.getItem('fall_back_page');
    navigate(fallBack?fallBack:paths.HOME);
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    setError("Invalid credentials");
  }
};

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900 text-white font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 opacity-80 z-10"></div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-yellow-400 opacity-10 animate-float z-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${24 + Math.random() * 40}px`,
            animationDuration: `${8 + Math.random() * 8}s`,
          }}
        >
          🦇
        </div>
      ))}

      <div className="relative z-30 flex items-center justify-center h-full">
        <div className="bg-black bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-yellow-800 max-w-sm w-full mx-4">
          <a href="/" className="flex items-center justify-center gap-3 mb-4 hover:opacity-90">
            <img src="/Dark.png" className="h-14 w-auto object-contain drop-shadow-md" alt="DarkJudge Logo" />
            <span className="text-3xl font-extrabold tracking-wide text-yellow-400 drop-shadow">DarkJudge</span>
          </a>
          <h1 className="text-2xl text-center -mt-4 font-bold">Login</h1>

          {error && (
            <p className="text-sm text-red-400 text-center mt-2">{error}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-indigo-300">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@gotham.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-200 transition duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-indigo-300">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-2.5 rounded-md bg-gray-800 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-200 transition duration-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-yellow-500 text-white hover:text-black font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              Join the Batcave
            </button>

            <button
              type="button"
              onClick={handleRegisterButtonClick}
              className="w-full mt-2 py-2 bg-gray-700 hover:bg-gray-600 text-indigo-200 rounded-md text-sm transition"
            >
              Go to Register Page
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-6 text-center italic">
            “It’s not who I am underneath, but what I do that defines me.”
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
