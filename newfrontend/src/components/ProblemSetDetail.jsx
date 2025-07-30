import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import paths from '../paths';


const ProblemSetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [setDetail, setSetDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const token = await getValidAccessToken();
      if (!token) return navigate('/login');
      try {
        const res = await axios.get(paths.BASE+`problems/problem-sets/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        setSetDetail(res.data);
      } catch (err) {
        console.error('Error fetching set detail', err);
      }
    };
    fetchDetail();
  }, [id, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        {!setDetail ? (
          <p className="text-yellow-400">Loading problem set...</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">{setDetail.problemSetTitle}</h1>
            <p className="text-indigo-300 text-sm mb-1">Topics: {setDetail.topics}</p>
            <p className="text-gray-400 text-sm mb-6">Difficulty: {setDetail.difficultyLevel}</p>

            <h2 className="text-xl text-indigo-400 mb-3">Problems</h2>
            <div className="space-y-3">
              {(setDetail.problems || []).map((prob, idx) => (
                <div
                  key={prob.id}
                  onClick={() => navigate(`/problems/${prob.id}/code-solution/`)}
                  className="p-4 border border-indigo-800 hover:border-yellow-400 bg-black/40 hover:bg-yellow-500/10 rounded-xl cursor-pointer transition"
                >
                  <span className="text-yellow-300 font-semibold text-lg mr-2">{idx+1}.</span>
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

export default ProblemSetDetail;
