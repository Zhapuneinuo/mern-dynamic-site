import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiUsers, FiImage, FiMessageSquare, FiMail,
  FiSettings, FiLogOut, FiMenu, FiChevronRight, FiHome
} from 'react-icons/fi';

const navItems = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
  { to: '/admin/gallery', icon: <FiImage />, label: 'Gallery' },
  { to: '/admin/feedback', icon: <FiMessageSquare />, label: 'Feedback' },
  { to: '/admin/contacts', icon: <FiMail />, label: 'Contacts' },
  { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 70 : 250, flexShrink: 0, background: '#0a111e',
        borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
      }}>
        {/* Brand */}
        <div style={{ padding: collapsed ? '20px 16px' : '20px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, color: 'white',
              }}>A</div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>Admin Panel</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18, padding: 4 }}>
            {collapsed ? <FiChevronRight /> : <FiMenu />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {navItems.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '12px 20px' : '12px 24px',
              color: isActive ? '#6366f1' : '#64748b',
              background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
              borderRight: isActive ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.2s', fontSize: 14, fontWeight: isActive ? 700 : 500,
              whiteSpace: 'nowrap',
            })}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User + bottom actions */}
        <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderTop: '1px solid #1e293b' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '10px', background: '#1e293b', borderRadius: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {user?.name?.[0]}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: '#64748b' }}>Administrator</p>
              </div>
            </div>
          )}
          <NavLink to="/" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', color: '#64748b', borderRadius: 8, fontSize: 13, marginBottom: 4,
          }}><FiHome /> {!collapsed && 'View Site'}</NavLink>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px',
            background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, borderRadius: 8, fontFamily: 'inherit',
          }}><FiLogOut /> {!collapsed && 'Logout'}</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '0' }}>
        <Outlet />
      </main>
    </div>
  );
}
