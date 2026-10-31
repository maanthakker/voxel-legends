import { useEffect, useState } from 'react';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const isLogin = mode === 'login';

  useEffect(() => {
    fetch('/api/health').then((r) => r.json()).then((h) => setTestMode(h.db === 'memory')).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not reach the server. Check your connection and try again.');
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <form onSubmit={submit} aria-describedby={error ? 'err' : undefined}>
        <h1>Voxel Realms</h1>
        <p className="tag">{isLogin ? 'Log in to play with your friends.' : 'Make an account. Your username is your name in the game.'}</p>
        <div className="tabs" role="tablist" aria-label="Account">
          <button type="button" role="tab" aria-selected={isLogin} className={isLogin ? 'on' : ''} onClick={() => { setMode('login'); setError(''); }}>Log in</button>
          <button type="button" role="tab" aria-selected={!isLogin} className={!isLogin ? 'on' : ''} onClick={() => { setMode('register'); setError(''); }}>New account</button>
        </div>
        <label>Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={16} autoComplete="username" autoCapitalize="off" spellCheck="false" required />
        </label>
        {!isLogin && <small>3 to 16 letters, numbers or _</small>}
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? 'current-password' : 'new-password'} required />
        </label>
        {!isLogin && <small>At least 6 characters</small>}
        {testMode && <div className="note">Test mode: accounts reset when the server restarts.</div>}
        {error && <div id="err" className="error" role="alert">{error}</div>}
        <button className="big" disabled={busy}>{busy ? 'Please wait\u2026' : isLogin ? 'Play' : 'Create account'}</button>
      </form>
    </main>
  );
}
