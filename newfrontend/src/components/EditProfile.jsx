import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import paths from '../paths';

const EditProfile = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getValidAccessToken();
      try {
        const response = await axios.get(`http://localhost:8000/user/profile/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        });

        if (data.profile_pic) {
          const fullUrl = data.profile_pic.startsWith('http')
            ? data.profile_pic
            : `BatmanDefaultPic.webp`;
          setPreviewPic(fullUrl);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed!');
        return;
      }
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
      console.log("Selected file:", file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed!');
        return;
      }
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
      console.log("Dropped file:", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getValidAccessToken();
    if (!token) {
      localStorage.setItem('fall_back_page', `/profile/${id}/edit`);
      navigate(paths.LOGIN);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    if (profilePic instanceof File) {
      data.append('profile_pic', profilePic);
    } else {
      console.warn('No valid file selected for profile_pic');
    }

    for (const pair of data.entries()) {
      console.log(pair[0], pair[1]); // For debugging
    }

    try {
      await axios.patch('http://localhost:8000/user/change-profile/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not manually set 'Content-Type'; axios will do it correctly for FormData
        },
      });
      alert('Profile updated successfully');
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-[120vh] bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white py-12 px-4">
        {[...Array(12)].map((_, i) => (
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
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">🛠️ Edit Your Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-semibold text-yellow-300">First Name</label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-semibold text-yellow-300">Last Name</label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-yellow-300">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-yellow-300">Profile Picture <span className="text-red-400"> (png,jpeg,jpg,webp ONLY!!)</span></label>
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
