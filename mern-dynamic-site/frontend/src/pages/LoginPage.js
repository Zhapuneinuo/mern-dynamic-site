import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, #0f172a 60%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 20, color: 'white',
            }}>M</div>
            <span style={{ fontWeight: 800, fontSize: 20 }}>DynaSite</span>
          </Link>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: '#64748b' }}>Sign in to your account</p>
        </div>

        <div className="card glow">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input className="form-control" type="email" placeholder="you@example.com" style={{ paddingLeft: 40 }}
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input className="form-control" type={showPw ? 'text' : 'password'} placeholder="••••••••" style={{ paddingLeft: 40, paddingRight: 40 }}
                  {...register('password', { required: 'Password required' })} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                }}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              <FiLogIn /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>Sign up</Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#475569' }}>
          <strong>Demo admin:</strong> admin@demo.com / admin123
        </p>
      </div>
    </div>
  );
}
