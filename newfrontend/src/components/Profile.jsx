import React, { useState, useEffect } from 'react';
import '../App.css';
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import paths from '../paths';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import axios from 'axios';
import UserSolutions from './UserSolutions';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewUser, setViewUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const current_user_id = localStorage.getItem('userId');
  console.log(current_user_id);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          navigate(paths.LOGIN);
          return;
        }
        const response = await axios.get(`http://localhost:8000/user/profile/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setViewUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, [id, navigate]);
  const handleLogoutClick = () => navigate(paths.LOGOUT);
  const handleEditProfileClick = () => navigate(`/profile/${id}/edit`);

  if (!viewUser) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white font-mono p-6">
        <div className="max-w-6xl mx-auto bg-[#1e1b4b] border border-indigo-800 rounded-3xl shadow-2xl p-8 space-y-8">
          
          <div className="flex space-x-4 border-b border-indigo-600 pb-2 mb-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-t-md font-semibold ${
                activeTab === 'profile'
                  ? 'bg-indigo-800 text-yellow-300'
                  : 'bg-indigo-700 text-indigo-300 hover:bg-indigo-600'
              }`}
            >
              🧑 View Profile
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-t-md font-semibold ${
                activeTab === 'submissions'
                  ? 'bg-indigo-800 text-yellow-300'
                  : 'bg-indigo-700 text-indigo-300 hover:bg-indigo-600'
              }`}
            >
              🧾 Submissions
            </button>
          </div>

          {activeTab === 'profile' ? (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <img
                  src={viewUser.profile_pic?`http://localhost:8000${viewUser.profile_pic}`:'BatmanDefaultPic.webp'}
                  alt="Profile"
                  className="w-36 h-36 rounded-full border-4 border-yellow-400 shadow-xl"
                />
                <div className="flex-1 space-y-2">
                  <h1 className="text-4xl font-extrabold text-yellow-400">{viewUser.username}</h1>
                  <p className="text-indigo-300 text-sm">{viewUser.email}</p>
                  <p className="text-indigo-400 text-sm italic">
                    Joined on: {new Date(viewUser.date_joined).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="mt-4 space-x-4">
                    {viewUser.id == current_user_id && <button 
                      onClick={handleEditProfileClick}
                      className="bg-indigo-800 hover:bg-indigo-900 text-white font-semibold px-5 py-2 rounded-xl shadow-lg transition">
                      ✏️ Edit Profile
                    </button>}
                    <button 
                      onClick={handleLogoutClick}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-xl shadow-lg transition">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-4 border-b border-indigo-700 pb-1">📊 Stats</h2>

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mb-6">
                  <div className="bg-gradient-to-r to-blue-700/30 border border-blue-500 rounded-xl p-6 shadow-md">
                    <p className="text-yellow-300 text-2xl font-extrabold">{viewUser.Score}</p>
                    <p className="text-indigo-200 text-sm mt-1">Total Score</p>
                  </div>
                  <div className="bg-gradient-to-r to-blue-700/30 border border-blue-500 rounded-xl p-6 shadow-md">
                    <p className="text-yellow-200 text-xl font-semibold">{`🦇 ${viewUser.first_name} ${viewUser.last_name}`}</p>
                    <p className="text-indigo-200 text-sm mt-1">Full Name</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-green-600/20 border border-green-400 rounded-xl p-4 shadow-sm">
                    <p className="text-green-300 text-lg font-bold">{viewUser.Easy_solved}</p>
                    <p className="text-green-100 text-sm">Easy Solved</p>
                  </div>
                  <div className="bg-yellow-600/20 border border-yellow-400 rounded-xl p-4 shadow-sm">
                    <p className="text-yellow-300 text-lg font-bold">{viewUser.Medium_solved}</p>
                    <p className="text-yellow-100 text-sm">Medium Solved</p>
                  </div>
                  <div className="bg-red-600/20 border border-red-400 rounded-xl p-4 shadow-sm">
                    <p className="text-red-300 text-lg font-bold">{viewUser.Hard_solved}</p>
                    <p className="text-red-100 text-sm">Hard Solved</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <UserSolutions userId={id} />
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
