import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import apiClient from '../api/client';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
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
            <UserPlus size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create Account</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Join AutoElite today
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
              <User size={14} /> Full Name
            </label>
            <input className="input" type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" required />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Mail size={14} /> Email
            </label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Phone size={14} /> Phone (Optional)
            </label>
            <input className="input" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <Lock size={14} /> Password
            </label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: '0.8125rem',
          color: 'var(--color-text-muted)', marginTop: '1.5rem',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
