// src/utils/authUtils.js
import axios from "axios";
import paths from "../paths";

export const getValidAccessToken = async () => {
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    return null;
  }

  try {
    await axios.get(paths.BASE+'api/is-auth/', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    return access_token;
  } catch (err) {
    try {
      const res = await axios.post(
        paths.BASE+'api/token/refresh/',
        { refresh: refresh_token },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('access_token', res.data.access);
      return res.data.access;
    } catch (refreshErr) {
      return null;
    }
  }
};
