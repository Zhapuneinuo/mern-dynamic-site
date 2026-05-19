import React, { useEffect, useState, useCallback } from 'react';
import { API } from '../../context/AuthContext';
import { FiCheck, FiTrash2, FiEye, FiRefreshCw, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await API.get(`/feedback?${params}`);
      setFeedbacks(data.feedbacks); setTotal(data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleUpdate = async (id, updates) => {
    try {
      const { data } = await API.put(`/feedback/${id}`, updates);
      setFeedbacks(prev => prev.map(f => f._id === id ? data.feedback : f));
      if (selected?._id === id) setSelected(data.feedback);
      toast.success('Updated!');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/feedback/${id}`);
      setFeedbacks(prev => prev.filter(f => f._id !== id)); setTotal(t => t - 1);
      toast.success('Deleted'); setSelected(null);
    } catch { toast.error('Failed'); }
  };

  const statusColor = { pending: '#f59e0b', reviewed: '#6366f1', resolved: '#10b981' };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Feedback</h1>
          <p style={{ color: '#64748b' }}>{total} total submissions</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select className="form-control" style={{ width: 150 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
          <button onClick={fetchFeedback} className="btn btn-outline btn-sm"><FiRefreshCw /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.5fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>From</th><th>Subject</th><th>Rating</th><th>Type</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}><div className="loading-spinner" /></td></tr>
                ) : feedbacks.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No feedback</td></tr>
                ) : feedbacks.map(f => (
                  <tr key={f._id} style={{ cursor: 'pointer', background: selected?._id === f._id ? 'rgba(99,102,241,0.08)' : 'transparent' }} onClick={() => setSelected(f)}>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</td>
                    <td style={{ fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.subject}</td>
                    <td>
                      {f.rating && <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(f.rating)}</span>}
                    </td>
                    <td><span className="badge badge-primary" style={{ fontSize: 10, textTransform: 'capitalize' }}>{f.type}</span></td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${statusColor[f.status]}22`, color: statusColor[f.status] }}>
                        {f.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{formatDistanceToNow(new Date(f.createdAt), { addSuffix: true })}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={(e) => { e.stopPropagation(); handleUpdate(f._id, { status: 'resolved', isPublic: !f.isPublic }); }}
                          className="btn btn-sm" style={{ padding: '4px 8px', background: f.isPublic ? 'rgba(16,185,129,0.2)' : '#1e293b', color: f.isPublic ? '#10b981' : '#64748b', border: 'none' }}
                          title={f.isPublic ? 'Public' : 'Private'}>
                          {f.isPublic ? '👁' : '🚫'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(f._id); }}
                          className="btn btn-sm btn-danger" style={{ padding: '4px 8px' }}><FiTrash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ position: 'sticky', top: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Feedback Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{selected.name}</p>
              <p style={{ color: '#64748b', fontSize: 13 }}>{selected.email}</p>
              {selected.rating && <p style={{ color: '#f59e0b', marginTop: 6 }}>{'★'.repeat(selected.rating)}{'☆'.repeat(5 - selected.rating)}</p>}
            </div>
            <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{selected.subject}</p>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 16, background: '#0f172a', padding: 12, borderRadius: 8 }}>{selected.message}</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['pending', 'reviewed', 'resolved'].map(s => (
                <button key={s} onClick={() => handleUpdate(selected._id, { status: s })}
                  style={{
                    padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: selected.status === s ? statusColor[s] : '#1e293b', color: selected.status === s ? 'white' : '#64748b',
                    textTransform: 'capitalize',
                  }}>{s}</button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Admin Reply</label>
              <textarea className="form-control" rows={3} placeholder="Type a reply..." value={replyText || selected.adminReply || ''} onChange={e => setReplyText(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(selected._id, { adminReply: replyText, status: 'resolved' })}>
              <FiCheck /> Save Reply
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
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
