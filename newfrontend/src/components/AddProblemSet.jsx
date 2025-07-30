import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import customSelectStyles from '../customSelectStyles';
import paths from '../paths';


function AddProblemSet() {
  const [problemSetTitle, setProblemSetTitle] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Easy');
  const [topics, setTopics] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const token = await getValidAccessToken();
      try {
        const response = await axios.get(paths.BASE+'problems/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const problemOptions = response.data.map(problem => ({
          value: problem.id,
          label: problem.problemTitle,
        }));
        setProblems(problemOptions);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getValidAccessToken();

    const payload = {
      problemSetTitle,
      difficultyLevel,
      topics,
      problemIds: selectedProblems.map(p => p.value),
    };

    try {
      await axios.post(
        paths.BASE+'problems/problem-sets/add-set/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Problem Set Created Successfully!');
      setProblemSetTitle('');
      setDifficultyLevel('Easy');
      setTopics('');
      setSelectedProblems([]);
    } catch (err) {
      console.error('Error creating problem set:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-[120vh] bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-900 text-white py-12 px-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-400 opacity-10 animate-float z-10"
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

        <div className="relative z-20 max-w-2xl mx-auto bg-black bg-opacity-60 backdrop-blur p-8 rounded-2xl shadow-lg border border-yellow-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">📚 Create a New Problem Set</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Problem Set Title */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Problem Set Title</label>
              <input
                type="text"
                value={problemSetTitle}
                onChange={(e) => setProblemSetTitle(e.target.value)}
                required
                placeholder="Enter title..."
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Difficulty Level</label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full bg-gray-800 text-yellow-300 px-4 py-2 rounded border border-indigo-700"
              >
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>
            </div>

            {/* Topics */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Topics (comma-separated)</label>
              <input
                type="text"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                required
                placeholder="e.g. Arrays, Trees"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Select Problems */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Select Problems</label>
              <Select
                options={problems}
                isMulti
                value={selectedProblems}
                onChange={setSelectedProblems}
                styles={customSelectStyles}
                placeholder="Search & select problems..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-yellow-400 text-white hover:text-black font-bold rounded-md transition duration-300"
            >
              ➕ Create Problem Set
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProblemSet;
