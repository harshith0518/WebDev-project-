import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import paths from '../paths';
import { useNavigate } from 'react-router-dom';



function Leaderboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          localStorage.setItem('fall_back_page', paths.LEADERBOARD);
          navigate(paths.LOGIN);
        }

        const res = await axios.get('http://localhost:8000/user/get-all/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white p-8 font-mono">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6">Leaderboard</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-yellow-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-700 bg-gray-900 rounded">
            <thead>
              <tr className="bg-gray-800 text-yellow-400 text-sm">
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2">Easy</th>
                <th className="px-4 py-2">Medium</th>
                <th className="px-4 py-2">Hard</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers
                  .sort((a, b) => b.Score - a.Score)
                  .map((user, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-700 hover:bg-indigo-900 transition duration-200 text-sm"
                    >
                      <td className="px-4 py-2">
                      <span
                          onClick={() => navigate(`/profile/${user.id}`)}
                          className="text-blue-400 hover:text-yellow-300 cursor-pointer underline"
                        >
                          {user.username}
                        </span>
                      </td>
                      <td className="text-center">{user.Easy_solved}</td>
                      <td className="text-center">{user.Medium_solved}</td>
                      <td className="text-center">{user.Hard_solved}</td>
                      <td className="text-center font-bold text-green-400">{user.Score}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
