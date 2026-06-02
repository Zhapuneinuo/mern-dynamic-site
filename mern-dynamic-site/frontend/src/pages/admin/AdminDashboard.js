import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../context/AuthContext';
import { FiUsers, FiImage, FiMessageSquare, FiMail, FiAlertCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/stats').then(({ data }) => setData(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;

  const cards = [
    { label: 'Total Users', value: data?.stats?.totalUsers, icon: <FiUsers />, color: '#6366f1', to: '/admin/users' },
    { label: 'Gallery Items', value: data?.stats?.totalGallery, icon: <FiImage />, color: '#8b5cf6', to: '/admin/gallery' },
    { label: 'Feedback', value: data?.stats?.totalFeedback, icon: <FiMessageSquare />, color: '#06b6d4', to: '/admin/feedback', badge: data?.stats?.pendingFeedback },
    { label: 'Contacts', value: data?.stats?.totalContacts, icon: <FiMail />, color: '#10b981', to: '/admin/contacts', badge: data?.stats?.newContacts },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 8 }}>Dashboard</h1>
        <p style={{ color: '#64748b' }}>Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="card" style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${c.color}22`, color: c.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{c.icon}</div>
              {c.badge > 0 && (
                <span style={{
                  background: '#ef4444', color: 'white', borderRadius: 20,
                  padding: '2px 8px', fontSize: 11, fontWeight: 700,
                }}>{c.badge} new</span>
              )}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: c.color, marginBottom: 4 }}>{c.value ?? '—'}</div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{c.label}</div>
            <div style={{
              position: 'absolute', right: -20, bottom: -20, width: 80, height: 80,
              borderRadius: '50%', background: `${c.color}11`,
            }} />
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Recent Users</h2>
          <Link to="/admin/users" style={{ color: '#6366f1', fontSize: 13, fontWeight: 600 }}>View all →</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentUsers?.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden',
                      }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name[0]}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: 14 }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'admin' ? 'warning' : 'primary'}`}>{u.role}</span></td>
                  <td style={{ color: '#64748b', fontSize: 13 }}>{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      {(data?.stats?.pendingFeedback > 0 || data?.stats?.newContacts > 0) && (
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data?.stats?.pendingFeedback > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiAlertCircle color="#f59e0b" />
              <span style={{ fontSize: 14 }}><strong>{data.stats.pendingFeedback}</strong> feedback items pending review.</span>
              <Link to="/admin/feedback" style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: 13, fontWeight: 600 }}>Review →</Link>
            </div>
          )}
          {data?.stats?.newContacts > 0 && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiAlertCircle color="#10b981" />
              <span style={{ fontSize: 14 }}><strong>{data.stats.newContacts}</strong> new contact messages.</span>
              <Link to="/admin/contacts" style={{ marginLeft: 'auto', color: '#10b981', fontSize: 13, fontWeight: 600 }}>View →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
