import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Map from './pages/Map';
import SaveLocalMap from './pages/SaveLocalMap';
import BlogPost from './pages/BlogPost';

function App() {
  const [user, setUser] = useState();

  const getUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
    } else {
      setUser(null);
    }
  };

  const login = (redirectUrl) => {
    let redirect = `${process.env.REACT_APP_API_URL}/auth/login/`;
    if (redirectUrl) {
      redirect += encodeURIComponent(
        `${process.env.REACT_APP_APP_URL}${redirectUrl}`,
      );
    } else {
      redirect += encodeURIComponent(
        `${process.env.REACT_APP_APP_URL}${window.location.pathname}`,
      );
    }
    window.location.href = redirect;
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    user !== undefined && (
      <Routes>
        <Route path="/" element={<Main user={user} login={login} />} />
        <Route path="/map/:id" element={<Map user={user} />} />
        <Route path="/save-local-map" element={<SaveLocalMap />} />
        <Route path="/post/:id" element={<BlogPost />} />
      </Routes>
    )
  );
}

export default App;
