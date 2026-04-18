# 🛡️ CyberShield NUM
### Cybersecurity Awareness Platform — Newgate University Minna

A full-stack web application built to improve cybersecurity awareness among students of Newgate University Minna. Based on real-world incidents and student survey data.

---

## 🌐 Login Credentials (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@newgateuniversityminna.edu.ng | Admin@NUM2025 |
| Student | demo@student.newgateuniversityminna.edu.ng | Student@123 |

---

## 🗂️ Project Structure

```
cybershield-num/
├── backend/           # Express.js + Prisma + MySQL
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── index.js
└── frontend/          # React + Vite + Tailwind CSS
    └── src/
        ├── pages/
        ├── pages/admin/
        ├── components/
        ├── store/
        └── utils/
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | Zustand |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | MySQL (XAMPP compatible) |
| Auth | JWT |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## ⚙️ Local Setup with XAMPP

### Prerequisites
- Node.js v18+ — https://nodejs.org
- XAMPP — https://apachefriends.org
- Git — https://git-scm.com

### 1. Start XAMPP MySQL
- Open XAMPP Control Panel
- Click **Start** next to MySQL
- Click **Admin** to open phpMyAdmin
- Click **New** → type `cybershield_num` → click **Create**

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` — set your MySQL password (blank by default in XAMPP):
```
DATABASE_URL="mysql://root:@localhost:3306/cybershield_num"
JWT_SECRET="cybershield-num-super-secret-key-change-in-production"
PORT=5000
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

Then run:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# .env should contain: VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open http://localhost:5173

---

## 🌍 Deployment (Production)

### Backend → Railway
1. Create project at railway.app → Deploy from GitHub → select `backend` folder
2. Add PostgreSQL or MySQL service
3. Set environment variables (DATABASE_URL, JWT_SECRET, FRONTEND_URL, NODE_ENV=production)
4. Railway auto-runs migrations on deploy
5. Run seed via Railway shell: `node prisma/seed.js`

### Frontend → Vercel
1. Import GitHub repo at vercel.com → Set Root Directory to `frontend`
2. Set: `VITE_API_URL = https://your-railway-app.up.railway.app/api`
3. Deploy — Vercel auto-detects Vite

---

## ✨ Features

### Student Features
- Registration & Login with JWT auth
- Personal XP & level progression
- 5 interactive learning modules (Phishing, Password Security, Social Engineering, Ransomware, Safe Browsing)
- 10-question quizzes with detailed explanations
- 4 real-life scenario simulations based on NUM incidents
- Public leaderboard with live rankings
- 10 unlockable achievement badges
- Daily login streaks & security tips

### Admin Features
- Analytics dashboard with charts
- Full CRUD for modules, quiz questions, and scenarios
- Student management with search & pagination
- Suspend/unsuspend users
- View detailed student profiles & progress

---

## 🎭 Real Incident Scenarios

| Scenario | Based On | Difficulty |
|----------|----------|------------|
| The Fake Admissions Officer | Student defrauded via social media | Medium |
| The Compromised Account | Phishing link breach | Easy |
| The Exam Portal Crisis | DDoS attack during exams | Hard |
| Ransomware at NUM | School data locked by hackers | Hard |

---

## 📊 Research Findings Integrated

Based on a survey of 463 Newgate University Minna students:
- 49.7% have moderate cyber knowledge
- 83.2% believe awareness tools will improve behaviour
- Students strongly prefer: videos, quizzes, simulations
- Top desired topics: password security, phishing, social engineering

---

*Built for the Faculty of Computing & Information Technology, Newgate University Minna*
