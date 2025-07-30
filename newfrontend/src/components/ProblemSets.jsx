import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import paths from '../paths';

const ProblemSets = () => {
  const [sets, setSets] = useState([]);
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStaff,setIsStaff] = useState(false);
  const navigate = useNavigate();


  useEffect( () => {
    const getIsStaff = async () => {
      const token = await getValidAccessToken();
      if(!token) 
      {
        localStorage.setItem('fall_back_page',paths.PROBLEMSETS);
        navigate(paths.LOGIN);
      }
      try {
        const res = await axios.get(paths.BASE+'user/is_staff/',{
          headers: {Authorization:`Bearer ${token}`},
        });
        setIsStaff(res.data.is_staff);
      } catch (err) {
        console.error('Error getting the staff verification');
      }
    };
    getIsStaff();
  },[]);

  useEffect(() => {
    const fetchSets = async () => {
      const token = await getValidAccessToken();
      if(!token) 
      {
        localStorage.setItem('fall_back_page',location.pathname);
        navigate(paths.LOGIN);
      }
      try {
        const res = await axios.get(paths.BASE+'problems/problem-sets/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSets(res.data);
      } catch (err) {
        console.error('Error fetching problem sets', err);
      }
    };
    fetchSets();
  }, [navigate]);

  const filteredSets = sets.filter((set) => {
    const s = search.toLowerCase();
    return (
      set.problemSetTitle.toLowerCase().includes(s) ||
      set.topics.toLowerCase().includes(s) ||
      set.difficultyLevel.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filteredSets.length / perPage);
  const paginatedSets = filteredSets.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white">
      <Navbar />

      {/* 🦇 Bat Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 opacity-10 animate-float"
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
      </div>

      <div className="relative z-20 max-w-4xl mx-auto h-[85vh] mt-4 p-6 bg-black/30 border border-yellow-700 rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-black">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-yellow-400 text-center sm:text-left">Problem Sets</h1>
          {isStaff && <button
            onClick={() => navigate(paths.ADDPROBLEMSETS)}
            className="mt-3 sm:mt-0 px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition"
          >
            ➕ Add Problem Set
          </button>}
        </div>


        {/* Search + Per Page */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <input
            type="text"
            placeholder="🔍 Search by title, topic, or difficulty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-indigo-700 rounded-md placeholder-indigo-300 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="flex items-center gap-2 text-sm">
            <label className="text-indigo-300">Per Page:</label>
            <select
              value={perPage}
              onChange={handlePerPageChange}
              className="bg-gray-800 border border-gray-700 text-yellow-300 px-2 py-1 rounded focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Problem Set Cards */}
        <div className="space-y-4">
          {paginatedSets.length === 0 ? (
            <p className="text-red-300">No matching problem sets found.</p>
          ) : (
            paginatedSets.map((set, index) => (
              <div
                key={index}
                onClick={() => navigate(`/problem-sets/${set.id}/problem-set`)}
                className="w-full bg-black/40 border border-yellow-600 hover:border-yellow-400 p-5 rounded-xl cursor-pointer transition hover:bg-yellow-500/10"
              >
                <h2 className="text-2xl font-semibold text-yellow-300">{set.problemSetTitle}</h2>
                <p className="text-indigo-300 text-sm mt-1">Topics: {set.topics}</p>
                <p className="text-gray-400 text-sm">Difficulty: {set.difficultyLevel}</p>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {filteredSets.length > perPage && (
          <div className="mt-6 flex justify-between items-center text-sm text-yellow-300">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded bg-gray-800 border border-yellow-600 hover:bg-yellow-600 hover:text-black transition ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              ⬅ Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded bg-gray-800 border border-yellow-600 hover:bg-yellow-600 hover:text-black transition ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSets;
