import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import Navbar from './Navbar';
import Select from 'react-select';
import topicOptions from '../TopicOptions'
import customSelectStyles from '../customSelectStyles';
import paths from '../paths';


const AddProblem = () => {
  const [formData, setFormData] = useState({
    problemTitle: '',
    problemStatement: '',
    constraints: '',
    sample_testcase_INP: '',
    sample_testcase_OUT: '',
    timeLimit: '',
    memoryLimit: '',
    difficultyLevel: 'Easy',
    testcases: null,
  });

  const [selectedTopics, setSelectedTopics] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, testcases: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getValidAccessToken();
    if (!token) return navigate('/login');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append('topics', selectedTopics.map(t => t.value).join(', '));

    try {
      await axios.post(paths.BASE+'problems/add-problem/', data, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Problem added successfully!');
      navigate(paths.PROBLEMS);
    } catch (err) {
      console.error(err);
      alert('Error uploading problem');
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
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">➕ Add a New Coding Problem</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Problem Title */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Problem Title</label>
              <input
                name="problemTitle"
                value={formData.problemTitle}
                onChange={handleChange}
                placeholder="Problem Title"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Problem Statement */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Problem Statement</label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                placeholder="Problem Statement"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700 min-h-[100px]"
              />
            </div>

            {/* Constraints */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Constraints</label>
              <textarea
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                placeholder="Constraints"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700 min-h-[80px]"
              />
            </div>

            {/* Topic Selector */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Topics</label>
              <Select
                isMulti
                options={topicOptions}
                placeholder="Search & select topics..."
                styles={customSelectStyles}
                value={selectedTopics}
                onChange={setSelectedTopics}
              />
            </div>

            {/* Sample Input */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Sample Input</label>
              <textarea
                name="sample_testcase_INP"
                value={formData.sample_testcase_INP}
                onChange={handleChange}
                placeholder="Sample Input"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Sample Output */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Sample Output</label>
              <textarea
                name="sample_testcase_OUT"
                value={formData.sample_testcase_OUT}
                onChange={handleChange}
                placeholder="Sample Output"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Time Limit */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Time Limit (in seconds)</label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Memory Limit */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Memory Limit (in MB)</label>
              <input
                type="number"
                name="memoryLimit"
                value={formData.memoryLimit}
                onChange={handleChange}
                placeholder="e.g. 256"
                className="w-full bg-gray-800 text-white placeholder-indigo-300 px-4 py-2 rounded border border-indigo-700"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Difficulty Level</label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full bg-gray-800 text-yellow-300 px-4 py-2 rounded border border-indigo-700"
              >
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>
            </div>

            {/* Upload Testcases */}
            <div>
              <label className="text-sm font-semibold text-yellow-300">Upload Zipped file <i className='text-red-600'>(name must be 'testcases')</i></label>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="w-full bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 bg-indigo-600 hover:bg-yellow-400 text-white hover:text-black font-bold rounded-md transition duration-300"
            >
              Upload Problem
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProblem;
