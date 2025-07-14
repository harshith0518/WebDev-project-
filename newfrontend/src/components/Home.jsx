import React from 'react';
import Navbar from './Navbar.jsx';
import '../App.css'


const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      
      <Navbar/>
      <hr/>
      {/* 💻 Main Content */}
      <div className="relative z-30 px-8 py-12 space-y-12">
        {/* 1. Hero Section */}
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-yellow-400 mb-3 hover:brightness-125 hover:saturate-150 transition">
            Dark-Judge
          </h1>
          <p className="text-gray-300 text-lg">Where coders rise in the shadows 🦇</p>
        </div>
      <hr/>

        {/* <div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {['Graph', 'DP', 'Greedy', 'Bitmask', 'Math', 'Strings', 'Brute Force'].map(tag => (
              <span key={tag} className="bg-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-400 hover:text-black transition">
                {tag}
              </span>
            ))}
          </div>
        </div> */}

        {/* 3. Problem of the Day */}
        <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-yellow-400 transition">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">Problem of the Day</h3>
          <p className="text-gray-300 mb-4">🦇 "Knight's Escape" — Help Batman escape a grid using knight moves. Can you solve it in under 50ms?</p>
          <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold active:bg-indigo-700 transition">
            Solve Now
          </button>
        </div>

        {/* 4. Details */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { type: 'Total Users', Value: 291 },
            { type: 'Total Submissions', Value: 1298 },
            { type: 'Total Problems', Value: 45 }
          ].map(({ type, Value }) => (
            <div key={type} className="bg-gray-900 p-5 rounded-xl text-center border-2 border-indigo-300 hover:bg-gray-800 transition">
              <h4 className="text-lg font-bold text-yellow-300">{type}</h4>
              <p className="text-gray-400 mt-2">Value: <span className="text-green-400">{Value}</span></p>
            </div>
          ))}
        </div>

        {/* 5. Practice Sets */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-3">Practice Sets</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {['Basics Pack', 'DP Essentials', 'Graph Mastery', 'Binary Search Set', 'Math Toolkit'].map(title => (
              <div key={title} className="bg-gray-800 p-4 rounded-xl hover:bg-yellow-400 hover:text-black transition">
                <h4 className="font-bold text-lg">{title}</h4>
                <p className="text-sm mt-1">15+ problems • mixed difficulty</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Submission Summary */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-yellow-300">Submission Summary</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li>✅ You solved <b>4</b> problems today.</li>
            <li>🔥 Streak span: <span className="text-green-400">38 days</span></li>
            <li>📈 Overall Accuracy: <span className="text-yellow-400">89%</span></li>
          </ul>
        </div>

        {/* 7. Judge Info */}
        <div className="bg-[#091122] p-4 rounded-xl flex items-center justify-between text-sm">
          <div>
            <span className="text-yellow-400 font-bold">Compiler Versions:</span> GCC 13.2 | Python 3.12 | Java 17
          </div>
          <div className="text-green-400 font-semibold">🟢 Judge Online</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
