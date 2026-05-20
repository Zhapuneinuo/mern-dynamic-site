import React, { useEffect, useState, useCallback } from 'react';
import { API } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiHeart, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Laptops',
  'Smartphones',
  'Tablets & ipads',
  'Printers',
  'Camera & Smart devices',
  'Storage & Networking',
  'Audio',
  'other',
];

const API_BASE = process.env.REACT_APP_API_URL;
const resolveImageUrl = (url) => {
  if (!url) return url;

  // Backend stores local paths like: /uploads/gallery/<file>
  if (url.startsWith('/')) {
    // If API_BASE is provided, respect it; otherwise use same-origin so /uploads works behind the proxy.
    return API_BASE ? `${API_BASE}${url}` : url;
  }

  return url;
};


export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // 'add' | 'edit' | null
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', imageFile: null, category: 'other', tags: '', order: 0, isActive: true });

  const [confirmDel, setConfirmDel] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/gallery?page=${page}&limit=12`);
      setItems(data.items || []); setTotal(data.total);
    } catch { toast.error('Failed to load gallery'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openAdd = () => {
    setForm({ title: '', description: '', imageFile: null, category: 'other', tags: '', order: 0, isActive: true });
    setCurrent(null);
    setModal('add');
  };

  const openEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description || '',
      imageFile: null,
      category: item.category,
      tags: item.tags?.join(', ') || '',
      order: item.order,
      isActive: item.isActive,
    });
    setCurrent(item);
    setModal('edit');
  };


  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description || '');
      fd.append('category', form.category);
      fd.append('tags', form.tags || '');
      fd.append('order', String(form.order || 0));
      fd.append('isActive', String(form.isActive));
      if (form.imageFile) fd.append('image', form.imageFile);

      if (modal === 'add') {
        const { data } = await API.post('/gallery', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setItems(prev => [data.item, ...prev]);
        setTotal(t => t + 1);
        toast.success('Added!');
      } else {
        const { data } = await API.put(`/gallery/${current._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setItems(prev => prev.map(i => i._id === current._id ? data.item : i));
        toast.success('Updated!');
      }

      setModal(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error');
    }
  };


  const handleDelete = async (id) => {
    try {
      await API.delete(`/gallery/${id}`);
      setItems(prev => prev.filter(i => i._id !== id)); setTotal(t => t - 1);
      toast.success('Deleted'); setConfirmDel(null);
    } catch { toast.error('Failed'); }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Gallery</h1>
          <p style={{ color: '#64748b' }}>{total} items total</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchItems} className="btn btn-outline btn-sm"><FiRefreshCw /></button>
          <button onClick={openAdd} className="btn btn-primary btn-sm"><FiPlus /> Add Item</button>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="loading-spinner" /></div>
      ) : (
        <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {items.map(item => (
            <div key={item._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0f172a' }}>
<img
                  src={resolveImageUrl(item.thumbnailUrl || item.imageUrl)}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {!item.isActive && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 12 }}>HIDDEN</span>
                  </div>
                )}
              </div>
              <div style={{ padding: 14 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge badge-primary" style={{ fontSize: 10, textTransform: 'capitalize' }}>{item.category}</span>
                  <div style={{ display: 'flex', gap: 12, color: '#64748b', fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiEye size={12} />{item.views}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiHeart size={12} />{item.likes?.length || 0}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(item)} className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: 'center' }}><FiEdit2 /> Edit</button>
                  <button onClick={() => setConfirmDel(item._id)} className="btn btn-sm btn-danger" style={{ padding: '6px 10px' }}><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {Math.ceil(total / 12) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: page === p ? '#6366f1' : '#1e293b', color: page === p ? 'white' : '#94a3b8', fontWeight: 600,
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <GalleryModal title={modal === 'add' ? 'Add Gallery Item' : 'Edit Gallery Item'} form={form} setForm={setForm}
          onSubmit={handleSubmit} onClose={() => setModal(null)} />
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="card" style={{ maxWidth: 380, width: '100%', margin: 24 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Delete Item?</h2>
            <p style={{ color: '#94a3b8', marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDel)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryModal({ title, form, setForm, onSubmit, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24, overflowY: 'auto' }}>
      <div className="card" style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        {[
          { label: 'Title *', key: 'title', type: 'text', placeholder: 'Image title' },
          { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Optional description' },
          { label: 'Tags', key: 'tags', type: 'text', placeholder: 'nature, forest, green' },
          { label: 'Order', key: 'order', type: 'number', placeholder: '0' },
        ].map(f => (
          <div key={f.key} className="form-group">
            <label className="form-label">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea className="form-control" rows={3} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ resize: 'vertical' }} />
            ) : (
              <input className="form-control" type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            )}
          </div>
        ))}

        <div className="form-group">
          <label className="form-label">Image File {title && '*'}</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Visible</label>
            <select className="form-control" value={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>
        {form.imageFile && (
          <div style={{ marginBottom: 16 }}>
            <img
              src={URL.createObjectURL(form.imageFile)}
              alt="Preview"
              style={{ width: '100%', borderRadius: 8, maxHeight: 180, objectFit: 'cover' }}
              onError={e => (e.target.style.display = 'none')}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
