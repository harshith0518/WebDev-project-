import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Navbar from './Navbar';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';

function AddProblemSet() {
  const [problemSetTitle, setProblemSetTitle] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [topics, setTopics] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const token = await getValidAccessToken();
      try {
        const response = await axios.get('http://localhost:8000/problems/', {
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
        'http://localhost:8000/problems/problem-sets/add-set/',
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
      setDifficultyLevel('');
      setTopics('');
      setSelectedProblems([]);
    } catch (err) {
      console.error('Error creating problem set:', err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

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
      <div className="relative z-10 flex justify-center items-center pt-24 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 bg-opacity-90 backdrop-blur p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-6 border border-yellow-500"
        >
          <h2 className="text-3xl font-bold text-yellow-400 text-center">Create a New Problem Set</h2>

          <div>
            <label className="block mb-1 text-sm font-semibold text-yellow-300">Problem Set Title</label>
            <input
              type="text"
              value={problemSetTitle}
              onChange={(e) => setProblemSetTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-yellow-300">Difficulty Level</label>
            <input
              type="text"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-yellow-300">Topics (comma-separated)</label>
            <input
              type="text"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-yellow-300">Select Problems</label>
            <Select
              options={problems}
              isMulti
              value={selectedProblems}
              onChange={setSelectedProblems}
              className="text-black bg-white rounded-md"
              classNamePrefix="select"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition duration-200"
          >
            Create Problem Set
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProblemSet;
