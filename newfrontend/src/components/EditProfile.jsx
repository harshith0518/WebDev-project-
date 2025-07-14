import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import Navbar from './Navbar';
import { useDropzone } from 'react-dropzone';
import '../App.css';

const EditProfile = () => {
  const [user, setUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    profile_pic: null,
  });
  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getValidAccessToken();
      if (!token) return navigate('/login');
      try {
        const res = await axios.get('http://localhost:8000/user/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        if (res.data.profile_pic) {
          const cleanPath = res.data.profile_pic.replace(/^\/+/g, '').replace(/\/+$/g, '');
          setPreviewImage(`http://localhost:8000/${cleanPath}`);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };
    fetchUserData();
  }, [navigate]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUser((prev) => ({ ...prev, profile_pic: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getValidAccessToken();
    if (!token) return navigate('/login');

    try {
      const data = new user();
      Object.entries(user).forEach(([key, value]) => data.append(key, value));

      await axios.patch('http://localhost:8000/user/update-profile/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Profile updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      alert('❌ Error updating profile');
    }
  };

  const handlePasswordChange = async () => {
    const token = await getValidAccessToken();
    if (!token) return navigate('/login');

    try {
      await axios.post(
        'http://localhost:8000/user/change-password/',
        { new_password: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Password changed');
    } catch (err) {
      console.error('Password error:', err);
      alert('❌ Failed to change password');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return setConfirmDelete(true);
    const token = await getValidAccessToken();
    if (!token) return navigate('/login');

    try {
      await axios.delete(`http://localhost:8000/user/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('⚠️ Account deleted');
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('❌ Failed to delete account');
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-[130vh] bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white py-12 px-4">
        {[...Array(10)].map((_, i) => (
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

        <div className="relative z-20 max-w-xl mx-auto bg-black bg-opacity-60 backdrop-blur p-8 rounded-2xl shadow-lg border border-yellow-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">✏️ Edit Your Bat Profile</h2>

          {previewImage && (
            <div className="flex flex-col items-center mb-4">
              <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full shadow border-4 border-yellow-400" />
              <label className="mt-2 text-sm text-indigo-300">Current Profile Picture</label>
            </div>
          )}

          <label className="text-sm text-indigo-300 mb-1 block">Change Profile Picture</label>
          <div {...getRootProps()} className={`cursor-pointer w-full p-4 rounded border-2 ${isDragActive ? 'border-yellow-400 bg-indigo-800' : 'border-indigo-600 bg-gray-800'} text-center text-sm text-indigo-200 transition`}>
            <input {...getInputProps()} />
            {isDragActive ? 'Drop your new profile pic here...' : 'Drag & drop or click to upload a new profile picture'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-indigo-300 mb-1 block">Username</label>
              <input type="text" name="username" value={user.username || ''} onChange={handleChange} placeholder="Username"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700 focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-sm text-indigo-300 mb-1 block">First Name</label>
              <input type="text" name="first_name" value={user.first_name || ''} onChange={handleChange} placeholder="First Name"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700" />
            </div>
            <div>
              <label className="text-sm text-indigo-300 mb-1 block">Last Name</label>
              <input type="text" name="last_name" value={user.last_name || ''} onChange={handleChange} placeholder="Last Name"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700" />
            </div>
            <div>
              <label className="text-sm text-indigo-300 mb-1 block">Email</label>
              <input type="email" name="email" value={user.email || ''} onChange={handleChange} placeholder="Email"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700" />
            </div>
            <button type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-yellow-400 text-white hover:text-black font-semibold rounded-md shadow-lg transition duration-300"
            >
              💾 Save Changes
            </button>
          </form>

          <div className="mt-8">
            <h3 className="text-yellow-300 font-semibold mb-2">🔒 Change Password</h3>
            <label className="text-sm text-indigo-300 mb-1 block">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700" />
            <button onClick={handlePasswordChange}
              className="w-full mt-2 py-2 bg-blue-500 hover:bg-yellow-400 text-white hover:text-black rounded-md transition shadow-md"
            >
              Update Password
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-red-400 font-semibold mb-2">🧹 Delete Account</h3>
            <button onClick={handleDelete}
              className={`w-full py-2 ${confirmDelete ? 'bg-red-800' : 'bg-red-600'} hover:bg-red-900 text-white font-semibold rounded-md transition`}
            >
              {confirmDelete ? '❗ Confirm Delete' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
