import React, { useEffect, useState, useCallback } from 'react';
import { API } from '../../context/AuthContext';
import { FiTrash2, FiRefreshCw, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await API.get(`/contact?${params}`);
      setContacts(data.contacts); setTotal(data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleUpdate = async (id, updates) => {
    try {
      const { data } = await API.put(`/contact/${id}`, updates);
      setContacts(prev => prev.map(c => c._id === id ? data.contact : c));
      if (selected?._id === id) setSelected(data.contact);
      toast.success('Updated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/contact/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id)); setTotal(t => t - 1);
      toast.success('Deleted'); setSelected(null);
    } catch { toast.error('Failed'); }
  };

  const statusColor = { new: '#ef4444', read: '#f59e0b', replied: '#10b981', closed: '#64748b' };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Contact Messages</h1>
          <p style={{ color: '#64748b' }}>{total} messages</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="form-control" style={{ width: 150 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={fetchContacts} className="btn btn-outline btn-sm"><FiRefreshCw /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.5fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Name</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}><div className="loading-spinner" /></td></tr>
                ) : contacts.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No messages</td></tr>
                ) : contacts.map(c => (
                  <tr key={c._id} style={{ cursor: 'pointer', background: selected?._id === c._id ? 'rgba(99,102,241,0.08)' : 'transparent' }}
                    onClick={() => { setSelected(c); handleUpdate(c._id, { status: c.status === 'new' ? 'read' : c.status }); }}>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</td>
                    <td style={{ fontSize: 13, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${statusColor[c.status]}22`, color: statusColor[c.status] }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</td>
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                        className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }}><FiTrash2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="card" style={{ position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Message</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={`mailto:${selected.email}`} style={{ color: '#6366f1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><FiMail size={12} />{selected.email}</a>
                {selected.phone && <a href={`tel:${selected.phone}`} style={{ color: '#6366f1', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><FiPhone size={12} />{selected.phone}</a>}
              </div>
            </div>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>{selected.subject}</p>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 16, background: '#0f172a', padding: 12, borderRadius: 8 }}>{selected.message}</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['read', 'replied', 'closed'].map(s => (
                <button key={s} onClick={() => handleUpdate(selected._id, { status: s })}
                  style={{
                    padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: selected.status === s ? statusColor[s] : '#1e293b', color: selected.status === s ? 'white' : '#64748b',
                    textTransform: 'capitalize',
                  }}>{s}</button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Reply / Notes</label>
              <textarea className="form-control" rows={3} placeholder="Admin reply..." value={replyText || selected.adminReply || ''} onChange={e => setReplyText(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(selected._id, { adminReply: replyText, status: 'replied' })}>
              Save Reply
            </button>
          </div>
        )}
      </div>

      {Math.ceil(total / 10) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: page === p ? '#6366f1' : '#1e293b', color: page === p ? 'white' : '#94a3b8', fontWeight: 600,
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
