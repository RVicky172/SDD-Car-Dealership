import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // OAuth2 form expects username/password
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const tokenRes = await apiClient.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, refresh_token } = tokenRes.data;

      // Fetch user profile
      const userRes = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      login(userRes.data, access_token, refresh_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 8rem)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div className="glass" style={{
        padding: '3rem', borderRadius: 'var(--radius)',
        width: '100%', maxWidth: '26rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <LogIn size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem', marginBottom: '1rem',
            borderRadius: 'var(--radius)',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444', fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Mail size={14} /> Email
            </label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Lock size={14} /> Password
            </label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: '0.8125rem',
          color: 'var(--color-text-muted)', marginTop: '1.5rem',
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
