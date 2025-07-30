import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      const token = await getValidAccessToken();
      if (!token) return navigate('/login');
      try {
        const res = await axios.get(paths.BASE+'contests/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContests(res.data);
      } catch (err) {
        console.error('Failed to fetch contests', err);
      }
    };

    fetchContests();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">🏁 Available Contests</h1>
        <div className="space-y-4">
          {contests.map(contest => (
            <div
              key={contest.id}
              onClick={() => navigate(`/contests/${contest.id}`)}
              className="bg-black/40 border border-yellow-600 hover:border-yellow-400 p-4 rounded-xl cursor-pointer hover:bg-yellow-500/10 transition"
            >
              <h2 className="text-xl font-semibold text-yellow-300">{contest.title}</h2>
              <p className="text-gray-400 text-sm">Starts at: {new Date(contest.start_time).toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Duration: {contest.duration} minutes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contests;
