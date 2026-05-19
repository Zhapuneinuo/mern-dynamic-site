import React, { useEffect, useState } from 'react';
import { API } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { setSettings } = useSettings();
  const [form, setForm] = useState({
    siteName: '', siteDescription: '', heroTitle: '', heroSubtitle: '',
    aboutTitle: '', aboutContent: '',
    contactEmail: '', contactPhone: '', contactAddress: '',
    socialLinks: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
    primaryColor: '#6366f1', metaKeywords: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('general');

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      if (data.settings) setForm({ ...form, ...data.settings, socialLinks: { ...form.socialLinks, ...(data.settings.socialLinks || {}) } });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put('/settings', form);
      setSettings(data.settings);
      toast.success('Settings saved!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setSocial = (key, val) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'hero', label: 'Hero Section' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'appearance', label: 'Appearance' },
  ];

  if (loading) return <div className="page-loader"><div className="loading-spinner" /></div>;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 4 }}>Site Settings</h1>
          <p style={{ color: '#64748b' }}>Customize your website appearance and content</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#1e293b', padding: 4, borderRadius: 10, overflowX: 'auto', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: tab === t.id ? '#6366f1' : 'transparent',
            color: tab === t.id ? 'white' : '#94a3b8', transition: 'all 0.2s', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        {tab === 'general' && (
          <>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>General</h2>
            <Field label="Site Name" value={form.siteName} onChange={v => set('siteName', v)} />
            <Field label="Site Description" value={form.siteDescription} onChange={v => set('siteDescription', v)} type="textarea" />
            <Field label="Meta Keywords" value={form.metaKeywords} onChange={v => set('metaKeywords', v)} placeholder="keyword1, keyword2, ..." />
          </>
        )}
        {tab === 'hero' && (
          <>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Hero Section</h2>
            <Field label="Hero Title" value={form.heroTitle} onChange={v => set('heroTitle', v)} />
            <Field label="Hero Subtitle" value={form.heroSubtitle} onChange={v => set('heroSubtitle', v)} type="textarea" />
            <Field label="Hero Image URL" value={form.heroImage} onChange={v => set('heroImage', v)} placeholder="https://..." />
            <Field label="About Section Title" value={form.aboutTitle} onChange={v => set('aboutTitle', v)} />
            <Field label="About Content" value={form.aboutContent} onChange={v => set('aboutContent', v)} type="textarea" rows={5} />
          </>
        )}
        {tab === 'contact' && (
          <>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Contact Info</h2>
            <Field label="Contact Email" value={form.contactEmail} onChange={v => set('contactEmail', v)} type="email" />
            <Field label="Contact Phone" value={form.contactPhone} onChange={v => set('contactPhone', v)} />
            <Field label="Address" value={form.contactAddress} onChange={v => set('contactAddress', v)} type="textarea" />
          </>
        )}
        {tab === 'social' && (
          <>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Social Links</h2>
            {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(s => (
              <Field key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={form.socialLinks?.[s] || ''} onChange={v => setSocial(s, v)} placeholder={`https://${s}.com/...`} />
            ))}
          </>
        )}
        {tab === 'appearance' && (
          <>
            <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Appearance</h2>
            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input type="color" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                  style={{ width: 48, height: 48, border: 'none', cursor: 'pointer', borderRadius: 8, background: 'none', padding: 0 }} />
                <input className="form-control" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)} style={{ maxWidth: 140 }} />
                <div style={{ width: 48, height: 48, borderRadius: 8, background: form.primaryColor }} />
              </div>
            </div>
          </>
        )}

        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 8 }}>
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder = '', rows = 3 }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="form-control" rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ resize: 'vertical' }} />
      ) : (
        <input className="form-control" type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}
