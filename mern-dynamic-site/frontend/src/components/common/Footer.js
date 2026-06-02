import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer style={{ background: '#0a111e', borderTop: '1px solid #1e293b', padding: '60px 0 24px' }}>
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: 40, gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 16, color: 'white',
              }}>M</div>
              <span style={{ fontWeight: 800, fontSize: 18 }}>{settings.siteName || 'STS Kohima'}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>
              {settings.siteDescription || 'Smart Techies Service Kohima Official Website.'}
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, color: '#94a3b8', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Navigation</h4>
            {[['/', 'Home'], ['/gallery', 'Gallery'], ['/feedback', 'Feedback'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link key={path} to={path} style={{ display: 'block', color: '#64748b', marginBottom: 8, fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#6366f1'}
                onMouseLeave={e => e.target.style.color = '#64748b'}>{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, color: '#94a3b8', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Account</h4>
            {[['/login', 'Login'], ['/register', 'Register'], ['/dashboard', 'Dashboard'], ['/profile', 'Profile']].map(([path, label]) => (
              <Link key={path} to={path} style={{ display: 'block', color: '#64748b', marginBottom: 8, fontSize: 14 }}
                onMouseEnter={e => e.target.style.color = '#6366f1'}
                onMouseLeave={e => e.target.style.color = '#64748b'}>{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, color: '#94a3b8', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Contact</h4>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{settings.contactEmail || 'hello@dynasite.com'}</p>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>{settings.contactPhone || '+1 (555) 000-0000'}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8, background: '#1e293b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748b', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#64748b'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#475569', fontSize: 13 }}>© {new Date().getFullYear()} {settings.siteName || 'DynaSite'}. All rights reserved.</p>
          <p style={{ color: '#475569', fontSize: 13 }}>Visit STS Kohima Again📌</p>
        </div>
      </div>
    </footer>
  );
}
