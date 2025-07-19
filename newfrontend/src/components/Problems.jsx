import React, { useEffect, useState } from 'react';
import '../App.css';
import paths from '../paths';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Problems = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [problemsPerPage, setProblemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [problems, setProblems] = useState([]);
  const [isStaff, setIsStaff] = useState(false);

  const filteredProblems = problems.filter((prob) => {
    const titleMatch =
      prob.problemTitle &&
      prob.problemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const statementMatch =
      prob.problemStatement &&
      prob.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || statementMatch;
  });

  const indexOfLast = currentPage * problemsPerPage;
  const indexOfFirst = indexOfLast - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePerPageChange = (e) => {
    setProblemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // ✅ Fetch if user is staff
  useEffect(() => {
    const getIsStaff = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          localStorage.setItem('fall_back_page', paths.PROBLEMS);
          navigate(paths.LOGIN);
          return;
        }
        const response = await axios.get('http://localhost:8000/user/is_staff/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsStaff(response.data.is_staff);
      } catch (err) {
        console.error('Failed to check is_staff:', err);
      }
    };

    getIsStaff(); // 🟢 ACTUALLY CALLING IT!
  }, [navigate]);

  // ✅ Fetch all problems
  useEffect(() => {
    const getProblems = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          localStorage.setItem('fall_back_page', paths.PROBLEMS);
          navigate(paths.LOGIN);
          return;
        }
        const response = await axios.get('http://localhost:8000/problems/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProblems(response.data);
      } catch (err) {
        console.error('Failed to fetch problems:', err);
      }
    };

    getProblems();
  }, [navigate]);

  const handleGoToProblem = (problem) => {
    navigate(`/problems/${problem.id}/code-solution/`);
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans px-6 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 opacity-80 z-10"></div>

        {[...Array(20)].map((_, i) => (
          <div
            key={`bat-${i}`}
            className="absolute text-yellow-400 opacity-10 animate-float z-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${24 + Math.random() * 40}px`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          >
            🦇
          </div>
        ))}

        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-10 drop-shadow z-30 relative">
          Problems to Conquer
        </h1>

        {isStaff && (
          <div className="z-30 relative flex justify-center mb-4">
            <button
              onClick={() => navigate(paths.ADDPROBLEM)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 font-semibold rounded-xl transition"
            >
              ➕ Add New Problem
            </button>
          </div>
        )}

        <div className="z-30 relative mb-6 max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search problems by title or statement..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-1/2 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm text-gray-300">
              Problems per page:
            </label>
            <select
              id="perPage"
              value={problemsPerPage}
              onChange={handlePerPageChange}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 max-w-5xl mx-auto z-30 relative">
          {currentProblems.length === 0 ? (
            <p className="text-center text-gray-400">No problems found.</p>
          ) : (
            currentProblems.map((prob) => (
              <div
                key={prob.id}
                className="bg-gray-800 p-5 rounded-lg shadow hover:shadow-indigo-600 transition duration-300"
              >
                <h2 className="text-lg font-semibold text-indigo-300 mb-2">{prob.problemTitle}</h2>
                <p className="text-gray-300 mb-3">
                  {(prob.problemStatement || '').slice(0, 150)}...
                </p>
                <button
                  onClick={() => handleGoToProblem(prob)}
                  className="text-sm bg-indigo-600 hover:bg-yellow-400 hover:text-black px-4 py-1 rounded transition font-semibold"
                >
                  Solve Now
                </button>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 z-30 relative">
            <div className="flex gap-2 flex-wrap">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-white hover:bg-indigo-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Problems;
