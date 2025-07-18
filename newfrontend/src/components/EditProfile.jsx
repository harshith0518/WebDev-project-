import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const EditProfile = () => {
  const {id} = useParams();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getValidAccessToken();
      try {
        const response = await axios.get(`http://localhost:8000/user/profile/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        setUsername(data.username || '');
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');

        if (data.profile_pic) {
          setPreviewPic(data.profile_pic); // backend should return full URL
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getValidAccessToken();
    const formData = new FormData();

    // Only append non-empty fields
    if (username) formData.append('username', username);
    if (firstName) formData.append('first_name', firstName);
    if (lastName) formData.append('last_name', lastName);
    if (email) formData.append('email', email);
    if (profilePic) formData.append('profile_pic', profilePic); // match backend

    try {
      await axios.patch('/api/user/change-profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error.response || error);
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-[120vh] bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white py-12 px-4">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 opacity-10 animate-float z-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${24 + Math.random() * 30}px`,
              animationDuration: `${8 + Math.random() * 5}s`,
            }}
          >
            🦇
          </div>
        ))}

        <div className="relative z-20 max-w-2xl mx-auto bg-black bg-opacity-60 backdrop-blur p-8 rounded-2xl shadow-lg border border-yellow-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">🛠️ Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-yellow-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-semibold text-yellow-300">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-semibold text-yellow-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-yellow-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-yellow-300">Profile Picture</label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('profilePicInput').click()}
                className="w-full bg-gray-800 border-2 border-dashed border-blue-500 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700 transition"
              >
                {previewPic ? (
                  <img
                    src={previewPic}
                    alt="Preview"
                    className="mx-auto h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-300">Drag & drop or click to upload image</span>
                )}
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-yellow-400 text-white hover:text-black font-bold rounded-md transition duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
