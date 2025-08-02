import React, { useEffect, useState } from "react";
import '../App.css';
import paths from "../paths";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getValidAccessToken } from "../authUtils/getValidAccessToken";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginAndFetchUser = async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await axios.get(paths.BASE+'user/navbar/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginAndFetchUser();
  }, []);

  return (
    <nav className="bg-black shadow-md text-white font-bold">
      <div className="max-w-screen-xl mx-auto px-3 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <a href="/" className="flex items-center gap-3 px-2 py-1 hover:opacity-90">
            <img src="/Dark.png" className="h-10 w-auto object-contain drop-shadow-md" alt="DarkJudge Logo" />
            <span className="text-2xl md:text-3xl font-extrabold tracking-wide text-yellow-400 drop-shadow">
              DarkJudge
            </span>
          </a>

          <div className="hidden md:flex items-center space-x-6 text-sm font-bold ml-35">
            <Link className="text-indigo-500 hover:underline hover:text-yellow-400 transition" to={paths.PROBLEMS}>Problems</Link>
            <Link className="text-indigo-500 hover:underline hover:text-yellow-400 transition" to={paths.LEADERBOARD}>Leaderboard</Link>
            {/* <Link className="text-indigo-500 hover:underline hover:text-yellow-400 transition" to={paths.CONTESTS}>Contests</Link> */}
            <Link className="text-indigo-500 hover:underline hover:text-yellow-400 transition" to={paths.PROBLEMSETS}>ProblemSets</Link>
            <Link className="text-indigo-500 hover:underline hover:text-yellow-400 transition" to={paths.CODEIDE}>Code Editor</Link>
            <Link className="text-indigo-500 hover:underline hover:text-yellow-400 transition" to={paths.SOLUTIONS}>Solutions</Link>
          </div>
        </div>

        {!loading && (
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ?  (
                <span className="flex items-center gap-3 text-xl text-yellow-300">
                  <img
                    src={
                      user.profile_pic || '/BatmanDefaultPic.webp'
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-yellow-400 shadow"
                  />
                  <Link to={`/profile/${user?.id}`} className="hover:underline">
                    {user?.username}
                  </Link>
                </span>
              ) : (
              <>
                <button
                  className="bg-yellow-400 text-black hover:bg-indigo-600 hover:text-white transition px-4 py-1 rounded text-sm"
                  onClick={() => navigate(paths.LOGIN)}
                >
                  Login
                </button>
                <button
                  className="bg-yellow-400 text-black hover:bg-indigo-600 hover:text-white transition px-4 py-1 rounded text-sm"
                  onClick={() => navigate(paths.REGISTER)}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
        <div className="md:hidden">
          <button className="text-white hover:text-yellow-400 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
