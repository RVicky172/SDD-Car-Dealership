import { useQuery } from '@tanstack/react-query';
import { Search, Fuel, Settings2 } from 'lucide-react';
import { useState } from 'react';
import apiClient from '../api/client';
import { queryKeys } from '../api/queryKeys';

interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  status: string;
}

export default function Inventory() {
  const [search, setSearch] = useState('');

  const { data: cars, isLoading } = useQuery({
    queryKey: queryKeys.cars.all,
    queryFn: async () => {
      const res = await apiClient.get('/cars');
      return res.data as Car[];
    },
  });

  const filteredCars = cars?.filter(
    (car) =>
      car.title.toLowerCase().includes(search.toLowerCase()) ||
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Browse <span className="gradient-text">Inventory</span>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Discover your perfect ride from our verified listings
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search size={18} style={{
          position: 'absolute', left: '1rem', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--color-text-muted)',
        }} />
        <input
          className="input"
          style={{ paddingLeft: '2.75rem' }}
          placeholder="Search by make, model, or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cars Grid */}
      {isLoading ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          color: 'var(--color-text-muted)',
        }}>
          Loading inventory...
        </div>
      ) : filteredCars && filteredCars.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredCars.map((car) => (
            <div key={car.id} className="card">
              {/* Placeholder image */}
              <div style={{
                height: '12rem',
                background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-hover) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-muted)', fontSize: '3rem',
              }}>
                🚗
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{car.title}</h3>
                  <span className="badge">{car.status}</span>
                </div>
                <p style={{
                  color: 'var(--color-text-muted)', fontSize: '0.8125rem',
                  marginTop: '0.25rem',
                }}>
                  {car.make} {car.model} · {car.year}
                </p>
                <div className="gradient-text" style={{
                  fontSize: '1.25rem', fontWeight: 800, marginTop: '0.75rem',
                }}>
                  ₹{car.price.toLocaleString()}
                </div>
                <div style={{
                  display: 'flex', gap: '1rem', marginTop: '0.75rem',
                  color: 'var(--color-text-muted)', fontSize: '0.75rem',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Fuel size={12} /> {car.fuel_type}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Settings2 size={12} /> {car.transmission}
                  </span>
                  <span>{car.mileage.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{
          textAlign: 'center', padding: '4rem',
          borderRadius: 'var(--radius)',
        }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>No cars found</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Try adjusting your search or check back later for new listings.
          </p>
        </div>
      )}
    </div>
  );
}
