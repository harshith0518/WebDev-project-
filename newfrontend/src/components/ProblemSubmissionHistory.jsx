import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useNavigate } from 'react-router-dom';

function formatDateTime(datetimeStr) {
  if (!datetimeStr) return 'Invalid date';
  const date = new Date(datetimeStr);
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

const ProblemSubmissionHistory = ({ problemId, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) return;'<int:id>/solutions/solution/mine/'
        const res = await axios.get(`http://localhost:8000/problems/${problemId}/solutions/solution/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data || []);
      } catch (err) {
        console.error('Failed to fetch submission history:', err);
      }
    };

    fetchData();
  }, [problemId]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-gray-900 via-indigo-950 to-yellow-400 text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-yellow-300 mb-4">📜 Your Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-400">No submissions found for this problem.</p>
        ) : (
          <table className="w-full table-auto border border-gray-700 bg-gray-900 rounded text-sm">
            <thead>
              <tr className="bg-gray-800 text-yellow-400">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Verdict</th>
                <th className="px-4 py-2 text-left">Runtime</th>
                <th className="px-4 py-2 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sol) => (
                <tr
                  key={sol.id}
                  className="border-t border-gray-700 hover:bg-indigo-900 transition"
                >
                  <td className="px-4 py-2 text-blue-400 underline cursor-pointer" onClick={() => navigate(`/solutions/${sol.id}/solution`)}>
                    {sol.id}
                  </td>
                  <td className={`px-4 py-2 ${sol.success ? 'text-green-400' : 'text-red-400'}`}>
                    {sol.verdict}
                  </td>
                  <td className="px-4 py-2 text-blue-300">{sol.runtime} sec</td>
                  <td className="px-4 py-2 text-gray-400">{formatDateTime(sol.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProblemSubmissionHistory;
