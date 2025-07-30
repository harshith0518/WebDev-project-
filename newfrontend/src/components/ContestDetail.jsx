import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const ContestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getValidAccessToken();
      if (!token) return navigate('/login');

      try {
        const res = await axios.get(paths.BASE+`contests/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContest(res.data);
        setProblems(res.data.problems || []);

        const endTime = new Date(res.data.start_time).getTime() + res.data.duration * 60000;
        const interval = setInterval(() => {
          const now = new Date().getTime();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          setTimeLeft(remaining);
          if (remaining === 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error("Error loading contest", err);
      }
    };

    fetchData();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        {!contest ? (
          <p className="text-yellow-400 text-lg">Loading contest...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-yellow-400">{contest.title}</h1>
              <div className="text-lg font-mono text-indigo-300 bg-black px-4 py-2 rounded-xl border border-yellow-500">
                ⏳ {formatTime(timeLeft)}
              </div>
            </div>

            <h2 className="text-xl text-indigo-400 mb-4">📋 Problems</h2>
            <div className="space-y-4">
              {problems.map((prob, index) => (
                <div
                  key={prob.id}
                  onClick={() => navigate(`/problems/${prob.id}/code-solution/`)}
                  className="p-4 border border-indigo-800 hover:border-yellow-400 bg-black/40 hover:bg-yellow-500/10 rounded-xl cursor-pointer transition"
                >
                  <span className="text-yellow-300 font-semibold text-lg mr-2">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-white">{prob.problemTitle}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContestDetail;
