import { Link } from 'react-router-dom';
import { Search, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '6rem 2rem 4rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Gradient orbs */}
        <div style={{
          position: 'absolute', top: '-10rem', left: '50%', transform: 'translateX(-50%)',
          width: '40rem', height: '40rem', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '5rem', right: '10%',
          width: '20rem', height: '20rem', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '48rem', margin: '0 auto' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>
            🚗 Premium Car Marketplace
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Find Your{' '}
            <span className="gradient-text">Dream Car</span>
            <br />With Confidence
          </h1>
          <p style={{
            fontSize: '1.125rem', color: 'var(--color-text-muted)',
            maxWidth: '32rem', margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            Explore thousands of verified listings from trusted dealers.
            Compare prices, book test drives, and drive away happy.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/inventory">
              <button className="btn-primary" style={{
                padding: '0.875rem 2rem', fontSize: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                Browse Inventory
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                List Your Car
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        maxWidth: '64rem', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem',
      }}>
        {[
          {
            icon: <Search size={24} />,
            title: 'Smart Search',
            desc: 'Filter by make, model, price, fuel type, and more with our advanced search engine.',
          },
          {
            icon: <Shield size={24} />,
            title: 'Verified Dealers',
            desc: 'Every dealer is verified and licensed. Buy with confidence from trusted partners.',
          },
          {
            icon: <Zap size={24} />,
            title: 'Instant Booking',
            desc: 'Book test drives instantly. No calls needed — pick a slot and show up.',
          },
        ].map((feature, i) => (
          <div key={i} className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: 'var(--radius)',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-primary)', marginBottom: '1rem',
            }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {feature.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '3rem 2rem',
        maxWidth: '64rem', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem',
        textAlign: 'center',
      }}>
        {[
          { value: '10,000+', label: 'Cars Listed' },
          { value: '500+', label: 'Verified Dealers' },
          { value: '25,000+', label: 'Happy Buyers' },
          { value: '4.9★', label: 'Average Rating' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
            <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>
              {stat.value}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
