import React, { useState } from 'react';
import '../App.css';
import Navbar from './Navbar';
// Sample solution data with time
const sampleSolutions = [
  {
    id: 101,
    problem: 'Knight\'s Escape',
    author: 'DarkKnight',
    score: 100,
    submittedAt: '2025-07-06T14:35',
  },
  {
    id: 102,
    problem: 'Maze Runner',
    author: 'CodeFox',
    score: 80,
    submittedAt: '2025-07-06T09:20',
  },
  {
    id: 103,
    problem: 'Knight\'s Escape',
    author: 'ZeroBug',
    score: 70,
    submittedAt: '2025-07-07T17:10',
  },
  {
    id: 104,
    problem: 'Towers of Justice',
    author: 'KnightRider',
    score: 90,
    submittedAt: '2025-07-07T11:05',
  },
];

// Format the datetime string to readable date and time
const formatDateTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const datePart = date.toLocaleDateString();
  const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${datePart} ${timePart}`;
};

function Solutions() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSolutions = sampleSolutions.filter(
    (sol) =>
      sol.id.toString().includes(searchTerm) ||
      sol.problem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white p-8 font-mono">
      <h1 className="text-3xl font-bold text-yellow-300 mb-6">📚 Solutions</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by ID or Problem Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-yellow-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-700 bg-gray-900 rounded">
          <thead>
            <tr className="bg-gray-800 text-yellow-400 text-sm">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Problem</th>
              <th className="px-4 py-2 text-center">Score</th>
              <th className="px-4 py-2 text-center">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredSolutions.length > 0 ? (
              filteredSolutions.map((sol) => (
                <tr
                  key={sol.id}
                  className="border-t border-gray-700 hover:bg-indigo-900 transition duration-200 text-sm"
                >
                  <td className="px-4 py-2">{sol.id}</td>
                  <td className="px-4 py-2">{sol.author}</td>
                  <td className="px-4 py-2">{sol.problem}</td>
                  <td className="text-center text-green-400 font-bold">{sol.score}</td>
                  <td className="text-center">{formatDateTime(sol.submittedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No solutions found.
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

export default Solutions;
