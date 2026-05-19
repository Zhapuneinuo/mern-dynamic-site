# 🚀 MERN Dynamic Website

A full-stack, production-ready dynamic website built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## ✨ Features

### 🌐 Public Pages
| Page | Description |
|------|-------------|
| **Home** | Hero section, features, gallery preview, testimonials, CTA |
| **Gallery** | Filterable image gallery with lightbox, likes & views |
| **Feedback** | Star-rating feedback form with type classification |
| **Contact** | Contact form with admin notification |
| **Login/Register** | JWT auth with validation |

### 👤 User Dashboard
- Personalized welcome with profile overview
- Quick actions: gallery, feedback, contact
- Progress tracker
- Edit profile (avatar URL, bio, name)
- Change password securely

### 🛡️ Admin Panel (`/admin`)
| Section | Features |
|---------|----------|
| **Dashboard** | Stats cards, recent users, pending alerts |
| **Users** | List, search, filter, edit role/status, delete |
| **Gallery** | Add/edit/delete items with category & preview |
| **Feedback** | Review submissions, reply, mark public, status workflow |
| **Contacts** | View messages, reply, status management |
| **Settings** | Site name, hero text, contact info, social links, colors |

---

## 🧱 Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose (ODM)
- JWT Authentication
- bcryptjs (password hashing)
- express-validator
- helmet, cors, rate-limiting
- morgan (logging)

**Frontend**
- React 18 + React Router v6
- Context API (Auth + Settings)
- react-hook-form (forms)
- react-hot-toast (notifications)
- react-icons
- framer-motion (animations)
- date-fns
- axios

**DevOps**
- Docker + Docker Compose
- Nginx (reverse proxy + SPA routing)
- Multi-stage Docker builds

---

## 🏃 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Setup

```bash
git clone <your-repo>
cd mern-dynamic-site
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Seed Database (optional but recommended)

```bash
cd backend
node src/utils/seed.js
```

This creates:
- **Admin:** `admin@demo.com` / `admin123`
- **User:** `user@demo.com` / `user1234`
- Sample gallery items & site settings

---

## 🐳 Docker Deployment

### Run with Docker Compose

```bash
# Copy env
cp backend/.env.example backend/.env
# Edit JWT_SECRET in docker-compose.yml or .env

docker-compose up -d --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

### Stop

```bash
docker-compose down
```

---

## ☁️ Cloud Deployment

### Render.com (Free Tier)

**Backend (Web Service)**
1. Connect GitHub repo
2. Root: `backend/`
3. Build: `npm install`
4. Start: `node src/server.js`
5. Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`

**Frontend (Static Site)**
1. Root: `frontend/`
2. Build: `npm run build`
3. Publish: `build`
4. Add `REACT_APP_API_URL` if needed

### Railway.app

```bash
# Install Railway CLI
railway login
railway new
railway add --service backend
railway add --service frontend
railway add --plugin mongodb
railway up
```

### Vercel (Frontend) + Railway (Backend)

1. Deploy backend on Railway with MongoDB plugin
2. Deploy frontend on Vercel
3. Set `REACT_APP_API_URL` = your Railway backend URL

### VPS (Ubuntu) with PM2

```bash
# Install
npm install -g pm2

# Backend
cd backend
cp .env.example .env && nano .env
npm install
pm2 start src/server.js --name mern-backend

# Frontend build
cd frontend
npm install && npm run build
# Serve with nginx pointing to build/

pm2 save
pm2 startup
```

---

## 🔗 API Endpoints

### Auth
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login
GET  /api/auth/me          - Get current user (protected)
PUT  /api/auth/update-profile - Update profile (protected)
PUT  /api/auth/change-password - Change password (protected)
```

### Users (Admin only)
```
GET    /api/users          - List users (paginated, searchable)
GET    /api/users/stats    - Dashboard stats
GET    /api/users/:id      - Get user
PUT    /api/users/:id      - Update user
DELETE /api/users/:id      - Delete user
```

### Gallery
```
GET    /api/gallery         - Public gallery (filterable)
GET    /api/gallery/:id     - Single item
POST   /api/gallery         - Create (admin)
PUT    /api/gallery/:id     - Update (admin)
POST   /api/gallery/:id/like - Toggle like (auth)
DELETE /api/gallery/:id     - Delete (admin)
```

### Feedback
```
POST /api/feedback          - Submit feedback (public/auth)
GET  /api/feedback/public   - Public testimonials
GET  /api/feedback          - All feedback (admin)
PUT  /api/feedback/:id      - Update/reply (admin)
DELETE /api/feedback/:id    - Delete (admin)
```

### Contact
```
POST   /api/contact         - Submit contact form (public)
GET    /api/contact         - All contacts (admin)
PUT    /api/contact/:id     - Update/reply (admin)
DELETE /api/contact/:id     - Delete (admin)
```

### Settings
```
GET /api/settings           - Public settings
PUT /api/settings           - Update (admin)
```

---

## 🗂️ Project Structure

```
mern-dynamic-site/
├── backend/
│   ├── src/
│   │   ├── config/         db.js
│   │   ├── controllers/    auth, user, gallery, feedback, contact, settings
│   │   ├── middleware/      auth.js (JWT + role guard)
│   │   ├── models/         User, Gallery, Feedback, Contact, SiteSettings
│   │   ├── routes/         all route files
│   │   ├── utils/          generateToken.js, seed.js
│   │   └── server.js       Express app entry
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/css/     index.css (design system)
│   │   ├── components/     Navbar, Footer
│   │   ├── context/        AuthContext, SettingsContext
│   │   ├── pages/
│   │   │   ├── admin/      Dashboard, Users, Gallery, Feedback, Contacts, Settings + Layout
│   │   │   ├── user/       Dashboard, Profile
│   │   │   └── (public)    Home, Gallery, Contact, Feedback, Login, Register, 404
│   │   └── App.js          Routes + Guards
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔒 Security Features

- JWT authentication with expiry
- Password hashing with bcryptjs (salt rounds: 12)
- Role-based access control (admin/user)
- Rate limiting (100 req/15min per IP)
- Helmet.js security headers
- CORS configured
- Input validation (express-validator)

---

## 🎨 Design System

Dark theme with CSS custom properties:
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Violet)
- Accent: `#06b6d4` (Cyan)
- Background: `#0f172a` (Slate 900)

---

## 📌 Environment Variables

```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_dynamic_site
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

Built with ❤️ using the MERN Stack
