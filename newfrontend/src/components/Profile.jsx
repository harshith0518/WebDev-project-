import React from 'react';
import '../App.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import paths from '../paths';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useEffect } from 'react';


const UserProfile = () => {
  const navigate = useNavigate();
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          navigate(paths.LOGIN);
          return;
        };
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    checkAuth();
  }, []);

  const user = {
    id:1,
    username: 'KnightBatman',
    email: 'darkknight@gotham.com',
    profilePic: '/BatmanDefaultPic.webp',
    submissions: 42,
    problemsSolved: 13,
  };
  const handleLogoutClick = () => {
    navigate(paths.LOGOUT);
  };

  const handleEditProfileClick = () => {
    navigate(`/profile/${user.id}/edit`);
  }


  return (
    <>
        <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white font-mono p-6">
      <div className="max-w-4xl mx-auto bg-[#1e1b4b] border border-indigo-800 rounded-2xl shadow-xl p-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-yellow-400">{user.username}</h1>
            <p className="text-indigo-300 text-sm mt-1">{user.email}</p>

            <div className="mt-4 space-x-4">
              <button 
              onClick={handleEditProfileClick}
              className="bg-indigo-800 hover:bg-indigo-900 text-white font-semibold px-4 py-2 rounded-md shadow transition">
                ✏️ Edit Profile
              </button>
              <button 
              onClick={handleLogoutClick}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow transition">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-[#312e81] border border-indigo-700 rounded-lg p-4">
            <p className="text-yellow-400 text-lg font-bold">{user.submissions}</p>
            <p className="text-indigo-300 text-sm">Submissions</p>
          </div>
          <div className="bg-[#312e81] border border-indigo-700 rounded-lg p-4">
            <p className="text-yellow-400 text-lg font-bold">{user.problemsSolved}</p>
            <p className="text-indigo-300 text-sm">Solved Problems</p>
          </div>
          <div className="bg-[#312e81] border border-indigo-700 rounded-lg p-4">
            <p className="text-yellow-400 text-lg font-bold">C++</p>
            <p className="text-indigo-300 text-sm">Favorite Lang</p>
          </div>
          <div className="bg-[#312e81] border border-indigo-700 rounded-lg p-4">
            <p className="text-yellow-400 text-lg font-bold">🦇</p>
            <p className="text-indigo-300 text-sm">Alias</p>
          </div>
        </div>

        {/* History / Timeline */}
        <div className="mt-10">
          <h2 className="text-xl text-yellow-300 font-semibold mb-4 underline decoration-yellow-500 underline-offset-4">
            📝 Recent Activity
          </h2>
          <ul className="space-y-3 text-sm text-indigo-200 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
            <li>✔️ Solved “Knight’s Escape”</li>
            <li>📤 Submitted solution to “Binary Maze”</li>
            <li>📥 Downloaded test cases for “Grid Paths”</li>
            <li>🔁 Retried “Tower Defense” 2 times</li>
            <li>🏆 Earned “BFS Master” badge</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserProfile;
