import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSettings } from '../context/SettingsContext';
import { API } from '../context/AuthContext';
import { FiCamera, FiTablet, FiPrinter, FiHeadphones, FiHardDrive, FiTv, FiShoppingBag, FiZap, FiArrowRight } from 'react-icons/fi';

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


export default function HomePage() {
  const { settings } = useSettings();
  const [testimonials, setTestimonials] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  useEffect(() => {
    API.get('/feedback/public').then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {});
    API.get('/gallery?limit=6').then(({ data }) => setGalleryPreview(data.items || [])).catch(() => {});
  }, []);

  const features = [
    { icon: <FiCamera size={24} />, title: 'Camera & Smart devices', desc: 'Cameras, CCTV, Drones, Smart home devices' },
    { icon: <FiTablet size={30} />, title: 'Tablets & Smartphone', desc: 'Smartphones, Andriod Phones, iphones, Tablets, ipads, Smartwatches' },
    { icon: <FiPrinter size={24} />, title: 'Printers', desc: 'Printers, Inkjet Printers, Laser Printers, Scanner, Ink & Toner, Projector.' },
    { icon: <FiHeadphones size={24} />, title: 'Audio', desc: 'Earbuds, Headphones, Speakers, Bluetooth Speakers, Soundbars, Microphones' },
    { icon: <FiHardDrive size={24} />, title: 'Storage & Networking', desc: 'SSDs, Hard Drives, USB Drives, Memory cards, Router, Wi-Fi Extenders, NAS Storage' },
    { icon: <FiTv size={24} />, title: 'TV & Entertainment', desc: 'Smart TVs, Streaming Devices, Home Theater, TV Accessories' },
    { icon: <FiShoppingBag size={24} />, title: 'Accessories', desc: 'Keyboard, Mouse, USB Hubs, Charger, Cables, Adapter, Gaming Consoles' },
  ];

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 70 }}>
        <div className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20, fontSize: 13, color: '#a5b4fc', marginBottom: 28,
          }}>
            <FiZap size={13} />
            <span>Smart Techies Service Official Page</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: 24,
          }}>
            <span className="gradient-text">{settings.heroTitle || 'Welcome to Our Website'}</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            {settings.heroSubtitle || 'Official website of smart techies service, providing top-notch IT solution and services to clients worldwide. Explore our offering and discover how we can help your business thrive in the digital age.'}
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started <FiArrowRight />
            </Link>
            <Link to="/gallery" className="btn btn-outline btn-lg">
              View Gallery
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, flexWrap: 'wrap' }}>
            {[
              ['10+', 'Happy Users'],
              ['30+', 'Gallery Items'],
              ['89%', 'Uptime'],
              ['24/7', 'Support'],
            ].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#6366f1' }}>{num}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div> 
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Official website of smart techies service, providing top-notch IT solution and services to clients worldwide.
            </p>
          </div>
          <div className="grid grid-3">
            {features.map((f) => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', color: '#6366f1',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {galleryPreview.length > 0 && (
        <section className="section" style={{ background: '#0a111e' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: 8 }}>Our Gallery</h2>
                <p style={{ color: '#64748b' }}>A glimpse of our collection</p>
              </div>
              <Link to="/gallery" className="btn btn-outline">View All <FiArrowRight /></Link>
            </div>
            <div className="grid grid-3">
              {galleryPreview.slice(0, 6).map((item) => (
                <div key={item._id} style={{
                  borderRadius: 12, overflow: 'hidden', position: 'relative',
                  aspectRatio: '16/10', cursor: 'pointer', background: '#1e293b',
                }}
                onMouseEnter={e => { e.currentTarget.querySelector('.overlay').style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.querySelector('.overlay').style.opacity = 0; }}>
<img src={resolveImageUrl(item.imageUrl)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                  <div className="overlay" style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'flex-end', padding: 16,
                    opacity: 0, transition: 'opacity 0.3s',
                  }}>
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8' }}>{item.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 className="section-title">What People Say</h2>
            </div>
            <div className="grid grid-3">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t._id} className="card">
                  <div className="stars" style={{ marginBottom: 12 }}>
                    {'★'.repeat(t.rating || 5)}
                  </div>
                  <p style={{ color: '#94a3b8', marginBottom: 16, lineHeight: 1.6, fontStyle: 'italic' }}>"{t.message}"</p>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 16 }}>Ready to Get Started?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: '1.1rem' }}>
            Join us and enjoy our service today.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
