import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24,
      background: '#0f172a',
    }}>
      <div style={{
        fontSize: '8rem', fontWeight: 900, color: 'transparent',
        backgroundImage: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', lineHeight: 1,
        marginBottom: 16,
      }}>404</div>
      <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>Page Not Found</h1>
      <p style={{ color: '#64748b', marginBottom: 32, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg"><FiHome /> Go Home</Link>
    </div>
  );
}
