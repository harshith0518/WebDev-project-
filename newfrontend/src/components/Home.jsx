import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import '../App.css'
import { useEffect } from 'react';
import axios from 'axios';



const Home = () => {

  const [totalUsers,setTotalUsers] = useState(0);
  const [totalSolutions,setTotalSolutions] = useState(0);
  const [totalProblems,setTotalProblems] = useState(0);

  useEffect(() => {
    const getVals = async () => {
      try {
        const response = await axios.get('http://localhost:8000/home/');
        setTotalProblems(response.data.problemCnt);
        setTotalUsers(response.data.userCnt);
        setTotalSolutions(response.data.solutionCnt);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };
    getVals();
  }, []);
  console.log(totalProblems,totalSolutions,totalUsers);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      <Navbar/>
      <div className="relative z-30 px-8 py-12 space-y-12">
        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center z-30 space-y-6">
        <h1 className="text-6xl font-extrabold text-yellow-400 hover:brightness-125 hover:saturate-150 transition">
          Dark-Judge🦇
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl">
          Welcome to <span className="text-yellow-400 font-semibold">Dark-Judge</span> – an online coding arena inspired for the <span className="text-indigo-500 font-bold">BATMEN</span> . Face your toughest algorithmic challenges in a world where only the sharpest minds rise. Whether you're a silent knight or a code vigilante, justice begins here.
        </p>
      </div>
      <hr/>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { type: 'Total Users', value: totalUsers },
            { type: 'Total Submissions', value: totalSolutions },
            { type: 'Total Problems', value: totalProblems },
          ].map((counts) => (
            <div key={counts.type} className="bg-gray-900 p-5 rounded-xl text-center border-2 border-indigo-300 hover:bg-gray-800 transition">
              <h4 className="text-lg font-bold text-yellow-300">{counts.type}</h4>
              <p className="text-gray-400 mt-2"><span className="text-green-400">{counts.value}</span></p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mt-10 text-center max-w-4xl mx-auto">
  <h2 className="text-2xl font-bold text-yellow-300 mb-3">Practice Sets</h2>
  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
    <span className="text-yellow-400 font-medium">Problem Sets</span> help you master key topics like Dynamic Programming, Graphs, Math, and Binary Search.
    These themed bundles are designed to boost your preparation for coding interviews, contests, and real-world problem-solving. 🦇
  </p>
</div>

        <div className="bg-[#091122] p-4 rounded-xl flex items-center justify-between text-sm">
          <div>
            <span className="text-yellow-400 font-bold">Compiler Versions:</span> GCC 13.2 | Python 3.12 | Java 17
          </div>
          <div className="text-green-400 font-semibold">Judge Online</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
