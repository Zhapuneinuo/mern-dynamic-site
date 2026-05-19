import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await API.post('/feedback', { ...data, rating });
      setSent(true);
      reset();
      toast.success('Feedback submitted!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit feedback');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 70 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', borderBottom: '1px solid #334155', padding: '48px 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h1 className="section-title">Share Your Feedback</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Your opinion helps us improve. We read every submission!</p>
          </div>
        </div>

        <div className="container" style={{ padding: '60px 24px', maxWidth: 640, margin: '0 auto' }}>
          <div className="card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <FiCheckCircle size={48} style={{ color: '#10b981', marginBottom: 16 }} />
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Thank You!</h3>
                <p style={{ color: '#64748b', marginBottom: 24 }}>Your feedback has been received. We appreciate your input!</p>
                <button onClick={() => setSent(false)} className="btn btn-primary">Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2 style={{ fontWeight: 800, marginBottom: 8 }}>Leave a Review</h2>
                <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>Share your experience with us</p>

                {/* Star Rating */}
                <div className="form-group">
                  <label className="form-label">Rating *</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <FiStar size={28} fill={(hoverRating || rating) >= s ? '#f59e0b' : 'none'}
                          color={(hoverRating || rating) >= s ? '#f59e0b' : '#334155'} />
                      </button>
                    ))}
                    <span style={{ color: '#94a3b8', fontSize: 14, alignSelf: 'center', marginLeft: 8 }}>
                      {['','Poor','Fair','Good','Very Good','Excellent'][hoverRating || rating]}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-control" placeholder="Your name" {...register('name', { required: 'Name required' })} />
                    {errors.name && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.name.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-control" type="email" placeholder="your@email.com" {...register('email', { required: 'Email required' })} />
                    {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-control" {...register('type')}>
                    <option value="feedback">General Feedback</option>
                    <option value="testimonial">Testimonial</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input className="form-control" placeholder="Brief subject" {...register('subject', { required: 'Subject required' })} />
                  {errors.subject && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.subject.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea className="form-control" rows={5} placeholder="Tell us about your experience..." {...register('message', { required: 'Message required' })} style={{ resize: 'vertical' }} />
                  {errors.message && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.message.message}</p>}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  <FiSend /> {loading ? 'Submitting...' : 'Submit Feedback'}
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
