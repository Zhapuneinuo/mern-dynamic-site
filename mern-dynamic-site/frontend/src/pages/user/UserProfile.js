import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../context/AuthContext';
import { FiSave, FiLock, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, bio: user?.bio, avatar: user?.avatar },
  });

  const { register: reg2, handleSubmit: handle2, watch, formState: { errors: err2 } } = useForm();

  const onProfile = async (data) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const onPassword = async (data) => {
    setLoading(true);
    try {
      await API.put('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Change failed');
    } finally { setLoading(false); }
  };

  const tabs = [{ id: 'profile', label: 'Profile', icon: <FiUser /> }, { id: 'password', label: 'Password', icon: <FiLock /> }];

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 70, minHeight: '100vh' }}>
        <div className="container" style={{ padding: '60px 24px', maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 8 }}>Account Settings</h1>
          <p style={{ color: '#64748b', marginBottom: 32 }}>Manage your profile and security settings</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#1e293b', padding: 4, borderRadius: 10, width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                background: tab === t.id ? '#6366f1' : 'transparent',
                color: tab === t.id ? 'white' : '#94a3b8',
                transition: 'all 0.2s', fontFamily: 'inherit',
              }}>{t.icon} {t.label}</button>
            ))}
          </div>

          <div className="card">
            {tab === 'profile' ? (
              <form onSubmit={handleSubmit(onProfile)}>
                {/* Avatar preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: 20, background: '#0f172a', borderRadius: 10 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0,
                  }}>
                    {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>{user?.name}</p>
                    <p style={{ color: '#64748b', fontSize: 13 }}>{user?.email}</p>
                    <span className="badge badge-primary" style={{ marginTop: 6 }}>{user?.role}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" {...register('name', { required: 'Name required' })} />
                  {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar URL</label>
                  <input className="form-control" placeholder="https://..." {...register('avatar')} />
                  <p style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>Paste a URL to an image (or use Cloudinary/Imgur)</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" rows={4} placeholder="Tell us about yourself..." {...register('bio')} style={{ resize: 'vertical' }} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <form onSubmit={handle2(onPassword)}>
                <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Change Password</h3>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input className="form-control" type="password" placeholder="••••••••"
                    {...reg2('currentPassword', { required: 'Current password required' })} />
                  {err2.currentPassword && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{err2.currentPassword.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" placeholder="Min 6 chars"
                    {...reg2('newPassword', { required: 'New password required', minLength: { value: 6, message: 'Min 6 chars' } })} />
                  {err2.newPassword && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{err2.newPassword.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-control" type="password" placeholder="Repeat"
                    {...reg2('confirm', { required: 'Please confirm', validate: v => v === watch('newPassword') || 'Passwords do not match' })} />
                  {err2.confirm && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{err2.confirm.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <FiLock /> {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
