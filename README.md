# 🤖 AI Resume Screener

A full-stack AI-powered resume analysis tool. Upload a PDF resume, paste a job description, and get an instant AI-driven breakdown — match score, keyword gaps, section-level recommendations, and rewrite suggestions.

---

## ✨ Features

- **PDF Resume Upload** — drag-and-drop or file browser (PDF only)
- **AI Analysis** — match score, matched/missing keywords, overall summary, per-section recommendations, and rewrite suggestions
- **Interactive Dashboard** — score gauge, keywords bar chart, and radar chart (via Recharts)
- **Analysis History** — browse and delete past analyses
- **User Accounts** — register, login, and manage your profile
- **Protected Routes** — all core features require authentication
- **JWT Auth** — Bearer token stored in `localStorage`, auto-refreshed on load, auto-logout on 401

---

## 🧰 Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 7](https://vitejs.dev/) |
| Routing | [React Router DOM 7](https://reactrouter.com/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Charts | [Recharts 3](https://recharts.org/) |
| HTTP Client | [Axios](https://axios-http.com/) |

### Backend
| Layer | Technology |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) (Python) |
| Database | SQLite via [SQLAlchemy](https://www.sqlalchemy.org/) |
| Auth | JWT (Bearer tokens) |
| AI | Google Gemini / OpenAI (via backend service) |
| File Handling | PDF upload & parsing |

---

## 📁 Project Structure

```
AI_Resume/
├── Frontend/
│   └── ai-resume-screener/
│       ├── src/
│       │   ├── App.tsx                  # Routes + HomePage + ProtectedRoute
│       │   ├── main.tsx                 # App entry, AuthProvider wrapper
│       │   ├── components/
│       │   │   ├── Header/              # Top nav bar
│       │   │   ├── Footer/              # Footer links
│       │   │   ├── auth/
│       │   │   │   ├── login/           # Login page
│       │   │   │   └── signup/          # Registration page
│       │   │   ├── Dashboard/
│       │   │   │   ├── ScoreChart.tsx   # ScoreGauge, KeywordsBarChart, SkillsRadar
│       │   │   │   └── RewriteSuggestions.tsx
│       │   │   ├── History/             # Analysis history page
│       │   │   └── profile/             # User profile page
│       │   ├── context/
│       │   │   └── AuthContext.tsx      # Auth state, login/register/logout
│       │   └── services/
│       │       └── api.ts               # Axios instance + all API calls
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
│
└── Backend/
    ├── app/
    │   ├── main.py                      # FastAPI app, CORS, route registration
    │   ├── database.py                  # SQLAlchemy engine & session
    │   ├── config.py                    # Environment config
    │   ├── models/                      # SQLAlchemy ORM models (user, resume)
    │   ├── schemas/                     # Pydantic request/response schemas
    │   ├── routes/
    │   │   ├── auth.py                  # /auth/register, /auth/login, /auth/me
    │   │   ├── resume.py                # /resume/upload, /resume/my-resumes
    │   │   ├── analyze.py               # /analyze/
    │   │   ├── history.py               # /history/
    │   │   └── profile.py               # /profile/
    │   └── services/                    # AI analysis logic
    ├── uploads/                         # Uploaded PDF files
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **Python** 3.10+

---

### 1. Backend Setup

```bash
cd AI_Resume/Backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `Backend/` directory (refer to `.env` for required keys):

```env
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your_google_gemini_api_key   # or equivalent AI key
```

Start the backend server:

```bash
uvicorn app.main:app --reload
# Runs on http://localhost:8000
# Interactive API docs: http://localhost:8000/docs
```

---

### 2. Frontend Setup

```bash
cd AI_Resume/Frontend/ai-resume-screener

npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 API Reference

All endpoints are served from `http://localhost:8000`.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login — returns `access_token` |
| `GET` | `/auth/me` | Get current user (requires Bearer token) |
| `PUT` | `/auth/profile` | Update name/email |

### Resume

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/resume/upload` | Upload a PDF — returns `{ id }` |
| `GET` | `/resume/my-resumes` | List all uploaded resumes |

### Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze/` | Analyze resume against a job description |

**Request body:**
```json
{
  "resume_id": 1,
  "job_description": "We are looking for a Senior React Developer..."
}
```

**Response includes:**
- `match_score` — percentage fit
- `matched_keywords` — skills/terms found in the resume
- `missing_keywords` — required terms absent from the resume
- `overall_summary` — narrative summary of the fit
- `recommendations` — per-section `{ section, issue, suggestion }`
- `rewrite_suggestions` — improved bullet point rewrites

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/history/` | Get all past analyses for the current user |
| `GET` | `/history/{id}` | Get a specific analysis |
| `DELETE` | `/history/{id}` | Delete a specific analysis |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/profile/` | Get extended profile data |

---

## 🛡️ Authentication Flow

1. User registers or logs in → backend returns a JWT `access_token`
2. Token is stored in `localStorage`
3. Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request
4. On a `401` response, the token is cleared and the user is redirected to `/login`
5. On app load, `AuthContext` calls `/auth/me` to restore the session silently

---

## 🏗️ Build for Production

```bash
# Frontend
cd Frontend/ai-resume-screener
npm run build
# Output: dist/

# Backend — run with a production ASGI server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 📜 License

This project is for educational/personal use. Feel free to fork and extend it.
