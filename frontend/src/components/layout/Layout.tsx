import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--color-text-muted)',
        fontSize: '0.8125rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        © 2026 AutoElite — Spec-Driven Car Dealership Platform
      </footer>
    </div>
  );
}
