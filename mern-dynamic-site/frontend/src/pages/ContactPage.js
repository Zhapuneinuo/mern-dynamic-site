import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { API } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { settings } = useSettings();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post('/contact', data);
      setSent(true);
      reset();
      toast.success('Message sent successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 70 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', borderBottom: '1px solid #334155', padding: '48px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h1 className="section-title">Get in Touch</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>We'd love to hear from you. Send us a message!</p>
          </div>
        </div>

        <div className="container section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, alignItems: 'start' }}>
            {/* Info */}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 16 }}>Contact Information</h2>
              <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
                Fill out the form and we'll get back to you within 24 hours.
              </p>
              {[
                { icon: <FiMail />, label: 'Email', value: settings.contactEmail || 'stskohima@gmail.com' },
                { icon: <FiPhone />, label: 'Phone', value: settings.contactPhone || '91+ 9876543210' },
                { icon: <FiMapPin />, label: 'Address', value: settings.contactAddress || 'Kohima 797001, Nagaland' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'rgba(99,102,241,0.15)', color: '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{icon}</div>
                  <div>
                    <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>{label}</p>
                    <p style={{ color: '#f1f5f9' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="card">
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <FiCheckCircle size={48} style={{ color: '#10b981', marginBottom: 16 }} />
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: '#64748b', marginBottom: 24 }}>We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn btn-primary">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" placeholder="John Doe" {...register('name', { required: 'Name is required' })} />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-control" type="email" placeholder="john@example.com" {...register('email', { required: 'Email is required' })} />
                      {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" placeholder="+1 (555) 000-0000" {...register('phone')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input className="form-control" placeholder="What's this about?" {...register('subject', { required: 'Subject is required' })} />
                    {errors.subject && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.subject.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-control" rows={5} placeholder="Tell us more..." {...register('message', { required: 'Message is required' })} style={{ resize: 'vertical' }} />
                    {errors.message && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.message.message}</p>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
