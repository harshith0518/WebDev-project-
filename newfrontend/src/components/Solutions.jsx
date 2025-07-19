import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useNavigate } from 'react-router-dom';

function formatDateTime(datetimeStr) {
  if (!datetimeStr) return 'Invalid date';

  const date = new Date(datetimeStr);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) return;

        const res = await axios.get('http://localhost:8000/problems/solutions/all/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSolutions(res.data);
      } catch (err) {
        console.error('Error fetching solutions:', err);
      }
    };

    fetchSolutions();
  }, []);

  const filteredSolutions = solutions.filter(
    (sol) =>
      sol.id.toString().includes(searchTerm) ||
      sol.problem.problemTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSolutions.length / pageSize);
  const paginatedSolutions = filteredSolutions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) setCurrentPage((p) => p - 1);
    if (direction === 'next' && currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white p-8 font-mono">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6">📚 Solutions</h1>

        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="🔍 Search by ID or Problem Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-yellow-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="pageSize" className="text-yellow-300">
              Show per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-2 py-1 bg-gray-800 border border-gray-700 text-yellow-300 rounded"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-700 bg-gray-900 rounded">
            <thead>
              <tr className="bg-gray-800 text-yellow-400 text-sm">
                <th className="px-4 py-2 text-left">sub-ID</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Problem</th>
                <th className="px-4 py-2 text-center">Verdict</th>
                <th className="px-4 py-2 text-center">Difficulty</th>
                <th className="px-4 py-2 text-center">Submit-Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSolutions.length > 0 ? (
                paginatedSolutions.map((sol) => (
                  <tr
                    key={sol.id}
                    className="border-t border-gray-700 hover:bg-indigo-900 transition duration-200 text-sm"
                  >
                    <td className="px-4 py-2"><span
                        onClick={() => navigate(`/solutions/${sol.id}/solution`)}
                        className="text-blue-400 hover:text-yellow-300 cursor-pointer underline"
                      >
                        {sol.id}
                      </span></td>

                    <td className="px-4 py-2">
                      <span
                        onClick={() => navigate(`/profile/${sol.user.id}`)}
                        className="text-blue-400 hover:text-yellow-300 cursor-pointer underline"
                      >
                        {sol.user.username}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      <span
                        onClick={() => navigate(`/problems/${sol.problem.id}/code-solution/`)}
                        className="text-purple-400 hover:text-yellow-300 cursor-pointer underline"
                      >
                        {sol.problem.problemTitle}
                      </span>
                    </td>

                    <td className={`text-center font-bold ${sol.success ? 'text-green-400' : 'text-red-400'}`}>
                      {sol.verdict}
                    </td>

                    <td className="text-center">{sol.problem.difficultyLevel}</td>
                    <td className="text-center">{formatDateTime(sol.submittedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No solutions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6 text-yellow-200 text-sm">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
};

export default Solutions;
