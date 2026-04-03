import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const didLoginSucceed = login(username, password);
    if (!didLoginSucceed) {
      setError('Invalid username or password');
      return;
    }

    const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';
    navigate(redirectPath, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #0ea5e9 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.28)',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Dumbbell size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#0f172a' }}>Shri Ram Fitness</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Sign in to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Username</span>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder=""
                required
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Password</span>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder=""
                required
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>
          </label>

          {error && (
            <p
              style={{
                margin: 0,
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.2rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
