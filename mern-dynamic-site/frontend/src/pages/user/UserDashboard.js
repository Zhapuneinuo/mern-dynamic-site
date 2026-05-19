import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiImage, FiMessageSquare, FiMail, FiArrowRight, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function UserDashboard() {
  const { user } = useAuth();

  const quickLinks = [
    { icon: <FiUser size={20} />, label: 'Edit Profile', to: '/profile', color: '#6366f1' },
    { icon: <FiImage size={20} />, label: 'Browse Gallery', to: '/gallery', color: '#8b5cf6' },
    { icon: <FiMessageSquare size={20} />, label: 'Leave Feedback', to: '/feedback', color: '#06b6d4' },
    { icon: <FiMail size={20} />, label: 'Contact Us', to: '/contact', color: '#10b981' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 70, minHeight: '100vh' }}>
        <div className="container section">
          {/* Welcome header */}
          <div className="card" style={{ marginBottom: 32, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0,
                overflow: 'hidden',
              }}>
                {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: '#94a3b8' }}>{user?.email}</p>
                {user?.lastLogin && (
                  <p style={{ color: '#64748b', fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiClock size={12} /> Last login: {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
                  </p>
                )}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="badge badge-primary" style={{ fontSize: 12, padding: '6px 14px' }}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 20 }}>Quick Actions</h2>
          <div className="grid grid-4" style={{ marginBottom: 40 }}>
            {quickLinks.map(({ icon, label, to, color }) => (
              <Link key={to} to={to} className="card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: `${color}22`, color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{icon}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{label}</p>
                  <p style={{ color: '#64748b', fontSize: 12 }}>Click to visit</p>
                </div>
                <FiArrowRight style={{ marginLeft: 'auto', color: '#475569' }} />
              </Link>
            ))}
          </div>

          {/* Profile Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Profile Info</h3>
              {[
                ['Name', user?.name],
                ['Email', user?.email],
                ['Role', user?.role],
                ['Bio', user?.bio || 'No bio set'],
                ['Member since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 13 }}>{key}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{val}</span>
                </div>
              ))}
              <Link to="/profile" className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Edit Profile</Link>
            </div>

            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Getting Started</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { done: true, text: 'Create your account' },
                  { done: !!user?.bio, text: 'Add a bio to your profile' },
                  { done: !!user?.avatar, text: 'Upload a profile picture' },
                  { done: false, text: 'Browse the gallery' },
                  { done: false, text: 'Leave your first feedback' },
                ].map(({ done, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: done ? '#10b981' : '#334155',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: 'white',
                    }}>{done ? '✓' : ''}</div>
                    <span style={{ fontSize: 14, color: done ? '#94a3b8' : '#f1f5f9', textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
