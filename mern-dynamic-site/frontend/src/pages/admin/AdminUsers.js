import React, { useEffect, useState, useCallback } from 'react';
import { API } from '../../context/AuthContext';
import { FiUser, FiEdit, FiTrash2, FiRefreshCw, FiSearch, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmDel, setConfirmDel] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      const { data } = await API.get(`/users?${params}`);
      setUsers(data.users); setTotal(data.total);
    } catch (e) { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search, role]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleEdit = async () => {
    try {
      const { data } = await API.put(`/users/${editing._id}`, editForm);
      setUsers(prev => prev.map(u => u._id === editing._id ? data.user : u));
      toast.success('User updated'); setEditing(null);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      setTotal(t => t - 1);
      toast.success('User deleted'); setConfirmDel(null);
    } catch (e) { toast.error('Failed to delete'); }
  };

  const pages = Math.ceil(total / 10);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Users</h1>
          <p style={{ color: '#64748b' }}>{total} total users</p>
        </div>
        <button onClick={fetchUsers} className="btn btn-outline btn-sm"><FiRefreshCw /> Refresh</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Search users..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="form-control" style={{ width: 140 }} value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}><div className="loading-spinner" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden',
                      }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.name[0]}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: 14 }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'admin' ? 'warning' : 'primary'}`}>{u.role}</span></td>
                  <td><span className={`badge badge-${u.isActive ? 'success' : 'danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ color: '#64748b', fontSize: 13 }}>{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditing(u); setEditForm({ name: u.name, email: u.email, role: u.role, isActive: u.isActive }); }}
                        className="btn btn-sm btn-outline" style={{ padding: '4px 10px' }}><FiEdit2 /></button>
                      <button onClick={() => setConfirmDel(u._id)}
                        className="btn btn-sm btn-danger" style={{ padding: '4px 10px' }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 20 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: page === p ? '#6366f1' : '#1e293b', color: page === p ? 'white' : '#94a3b8', fontWeight: 600, fontSize: 13,
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-control" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-control" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-control" value={editForm.isActive} onChange={e => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEdit}>Save Changes</button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {confirmDel && (
        <Modal title="Confirm Delete" onClose={() => setConfirmDel(null)}>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>Are you sure you want to delete this user? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setConfirmDel(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDel)}>Delete User</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
      <div className="card" style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
