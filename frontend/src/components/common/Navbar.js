import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiShield, FiGrid } from 'react-icons/fi';
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/feedback', label: 'Feedback' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid #334155' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: 'white',
          }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>{settings.siteName || 'STS Kohima'}</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} style={{
              padding: '8px 16px', borderRadius: 8,
              color: location.pathname === l.path ? '#6366f1' : '#94a3b8',
              fontWeight: 500, fontSize: 14, transition: 'all 0.2s',
              background: location.pathname === l.path ? 'rgba(99,102,241,0.1)' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Auth area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #334155', borderRadius: 40, padding: '6px 14px 6px 6px',
                cursor: 'pointer', color: '#f1f5f9',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'white',
                }}>
                  {user.avatar ? <img src={user.avatar} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} /> : user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, minWidth: 180,
                  background: '#1e293b', border: '1px solid #334155', borderRadius: 12,
                  padding: 8, zIndex: 999, boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}>
                  {isAdmin && (
                    <DropItem icon={<FiShield />} to="/admin" label="Admin Panel" />
                  )}
                  <DropItem icon={<FiGrid />} to="/dashboard" label="Dashboard" />
                  <DropItem icon={<FiUser />} to="/profile" label="Profile" />
                  <div style={{ borderTop: '1px solid #334155', margin: '8px 0' }} />
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 14px', background: 'none', border: 'none',
                    color: '#ef4444', fontSize: 14, cursor: 'pointer', borderRadius: 8,
                    fontFamily: 'inherit',
                  }}>
                    <FiLogOut /><span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', color: '#f1f5f9', cursor: 'pointer',
            display: 'none', fontSize: 22,
          }} className="mobile-menu-btn">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid #334155', background: '#0f172a', padding: '16px 24px',
        }}>
          {navLinks.map(l => (
            <Link key={l.path} to={l.path} style={{
              display: 'block', padding: '12px 0',
              color: location.pathname === l.path ? '#6366f1' : '#94a3b8',
              fontWeight: 500, borderBottom: '1px solid #1e293b',
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function DropItem({ icon, to, label }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', color: '#f1f5f9', fontSize: 14,
      borderRadius: 8, transition: 'background 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {icon}<span>{label}</span>
    </Link>
  );
}
