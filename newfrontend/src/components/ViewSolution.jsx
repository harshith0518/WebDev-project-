import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import '../App.css';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import paths from '../paths';

const ViewSolution = () => {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const location = useLocation();

 useEffect(() => {
  const fetchSolution = async () => {
    try {
      const token = await getValidAccessToken();  
      const response = await axios.get(`http://localhost:8000/problems/solutions/solution/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSolution(response.data);
    } catch (error) {
      console.error('Failed to fetch solution', error);
    }
  };

  fetchSolution();
}, [id]);


  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg text-yellow-300">Loading solution...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Navbar />
      <hr className="border-yellow-500" />

      <div className="relative z-30 p-8 space-y-10">
        <h1 className="text-4xl font-extrabold text-yellow-400 text-center">Solution Viewer</h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-indigo-400">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-green-400">Problem: <span className="text-white">{solution.problemTitle}</span></h2>
            <p className="text-sm text-gray-300 mt-1">
              Submitted by <span className="text-yellow-300">{solution.user}</span> at{" "}
              <span className="text-purple-300">{new Date(solution.submittedAt).toLocaleString()}</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300 mb-6">
            <div><span className="text-yellow-300 font-bold">Language:</span> {solution.language}</div>
            <div><span className="text-yellow-300 font-bold">Verdict:</span> <span className={`${solution.verdict === "Accepted" ? "text-green-400" : "text-red-400"}`}>{solution.verdict}</span></div>
            <div><span className="text-yellow-300 font-bold">Runtime:</span> {solution.runtime} ms</div>
            <div><span className="text-yellow-300 font-bold">Difficulty:</span> {solution.problemDifficulty || "Unknown"}</div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Submitted Code:</h3>
            <pre className="bg-black text-green-300 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap text-sm">
              {solution.code}
            </pre>
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs pt-8">
          Dark-Judge 🦇 — Empowering coders in the shadows
        </div>
      </div>
    </div>
  );
};

export default ViewSolution;
