import { Link, useNavigate } from 'react-router-dom';
import { Car, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Car size={28} style={{ color: 'var(--color-primary)' }} />
        <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          AutoElite
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/inventory" style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          fontWeight: 500,
          transition: 'color 0.2s',
        }}>
          Inventory
        </Link>

        {isAuthenticated && user ? (
          <>
            {(user.role === 'dealer' || user.role === 'admin') && (
              <Link to="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500,
              }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '999px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}>
              <User size={14} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                {user.full_name}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-outline" style={{
              padding: '0.375rem 0.875rem', fontSize: '0.8125rem',
              display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}>
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn-primary" style={{
              padding: '0.375rem 1rem', fontSize: '0.8125rem',
              display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}>
              <LogIn size={14} />
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
