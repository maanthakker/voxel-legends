import { useState } from 'react';
import Login from './Login.jsx';

function readUser() {
  try { return JSON.parse(localStorage.getItem('vr_user')); } catch { return null; }
}

export default function App() {
  const [user, setUser] = useState(readUser);

  if (!user) {
    return (
      <Login
        onLogin={(u, token) => {
          localStorage.setItem('vr_token', token);
          localStorage.setItem('vr_user', JSON.stringify(u));
          setUser(u);
        }}
      />
    );
  }

  const logout = () => {
    localStorage.removeItem('vr_token');
    localStorage.removeItem('vr_user');
    setUser(null);
  };

  return (
    <div className="play">
      <header>
        <span className="brand">Voxel Realms</span>
        <span className="who"><i aria-hidden="true" />Playing as <b>{user.username}</b></span>
        <button className="ghost" onClick={logout}>Log out</button>
      </header>
      {/* The game reads the login from this site's storage and connects to the multiplayer server itself. */}
      <iframe title="Voxel Realms" src="/game/index.html" allow="fullscreen; autoplay" />
    </div>
  );
}
