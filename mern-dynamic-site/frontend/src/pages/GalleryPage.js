import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiEye, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'nature', 'architecture', 'people', 'events', 'products', 'other'];

export default function GalleryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (category !== 'all') params.append('category', category);
      const { data } = await API.get(`/gallery?${params}`);
      setItems(data.items || []);
      setTotalPages(data.pages || 1);
    } catch (e) {
      toast.error('Failed to load gallery');
    } finally { setLoading(false); }
  }, [category, page]);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);
  useEffect(() => { setPage(1); }, [category]);

  const handleLike = async (id) => {
    if (!user) { toast.error('Login to like images'); return; }
    try {
      const { data } = await API.post(`/gallery/${id}/like`);
      setItems(prev => prev.map(i => i._id === id ? { ...i, likes: data.liked ? [...i.likes, user._id] : i.likes.filter(l => l !== user._id) } : i));
      toast.success(data.liked ? 'Liked!' : 'Unliked');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 70 }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', borderBottom: '1px solid #334155', padding: '48px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h1 className="section-title">Gallery</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Explore our curated collection of images</p>
          </div>
        </div>

        {/* Filter */}
        <div style={{ borderBottom: '1px solid #1e293b', padding: '16px 0', position: 'sticky', top: 70, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', zIndex: 10 }}>
          <div className="container" style={{ display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center' }}>
            <FiFilter size={14} style={{ color: '#64748b', flexShrink: 0 }} />
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: category === cat ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#1e293b',
                color: category === cat ? 'white' : '#94a3b8',
                fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="container section">
          {loading ? (
            <div className="page-loader"><div className="loading-spinner" /><p>Loading gallery...</p></div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
              <FiImage size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>No images in this category yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {items.map(item => (
                  <div key={item._id} style={{ borderRadius: 12, overflow: 'hidden', background: '#1e293b', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }} onClick={() => setSelected(item)}>
                      <img src={item.thumbnailUrl || item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <span style={{ background: 'rgba(0,0,0,0.6)', padding: '3px 10px', borderRadius: 10, fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{item.category}</span>
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{item.title}</h3>
                      {item.description && <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{item.description}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <button onClick={() => handleLike(item._id)} style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: user && item.likes?.includes(user._id) ? '#ef4444' : '#64748b',
                            fontSize: 13, transition: 'color 0.2s',
                          }}>
                            <FiHeart size={14} fill={user && item.likes?.includes(user._id) ? '#ef4444' : 'none'} />
                            {item.likes?.length || 0}
                          </button>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 13 }}>
                            <FiEye size={14} /> {item.views || 0}
                          </span>
                        </div>
                        {item.uploadedBy && (
                          <span style={{ fontSize: 12, color: '#475569' }}>by {item.uploadedBy.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: page === p ? '#6366f1' : '#1e293b',
                      color: page === p ? 'white' : '#94a3b8',
                      fontWeight: 600, fontSize: 14,
                    }}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '100%' }}>
            <img src={selected.imageUrl} alt={selected.title} style={{ width: '100%', borderRadius: 12, maxHeight: '70vh', objectFit: 'contain' }} />
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <h2 style={{ fontWeight: 700, marginBottom: 8 }}>{selected.title}</h2>
              {selected.description && <p style={{ color: '#94a3b8' }}>{selected.description}</p>}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
