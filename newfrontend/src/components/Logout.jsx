// src/components/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import paths from '../paths';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const refreshToken = localStorage.getItem('refresh');

      try {
        if (refreshToken) {
          await axios.post(
            paths.BASE+'api/logout/',
            { refresh: refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
      } catch (err) {
        console.error("Logout API failed:", err);
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate(paths.HOME);
    };

    performLogout();
  }, [navigate]);

  return null;
};

export default Logout;