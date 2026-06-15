import { LayoutDashboard, Car, MessageSquare, Calendar } from 'lucide-react';

export default function DealerDashboard() {
  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>
        <span className="gradient-text">Dealer Dashboard</span>
      </h1>

      {/* Stats Row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {[
          { icon: <Car size={20} />, label: 'Active Listings', value: '0' },
          { icon: <MessageSquare size={20} />, label: 'Inquiries', value: '0' },
          { icon: <Calendar size={20} />, label: 'Test Drives', value: '0' },
          { icon: <LayoutDashboard size={20} />, label: 'Total Views', value: '0' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{
            padding: '1.5rem', borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{
              width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-primary)',
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for future content */}
      <div className="glass" style={{
        padding: '4rem', borderRadius: 'var(--radius)',
        textAlign: 'center',
      }}>
        <LayoutDashboard size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Coming Soon</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Full dealer management panel with listing CRUD, analytics, and inquiry management.
        </p>
      </div>
    </div>
  );
}
