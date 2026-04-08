# Developer Portfolio Evaluator 🚀

A full-stack application to evaluate GitHub developer portfolios using AI insights.

## Project Structure

```
portfolio-evaluator/
├── client/              # React + Vite frontend
├── server/              # Node + Express backend
└── README.md
```

## Setup Instructions

### Backend Setup
```bash
cd server
npm install
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## API Health Check

Visit `http://localhost:5000/api/health` to verify backend is running.

## Deployment

### Frontend Deployment (Vercel)
```bash
# Ensure code is pushed to GitHub repository
git add .
git commit -m "Ready for deployment"
git push origin main

# Deploy to Vercel
# 1. Go to vercel.com and sign in
# 2. Click "New Project"
# 3. Import your GitHub repository
# 4. Vercel will detect the project settings from vercel.json
# 5. In project settings, add environment variable:
#    - Name: VITE_API_URL
#    - Value: https://your-backend-url.com/api (replace with your deployed backend URL)
# 6. Deploy
```

Frontend will be deployed to: Vercel URL (provided after deployment)

## Day 1 Checklist

- [x] Backend running on port 5000
- [x] `/api/health` endpoint working
- [x] Frontend running on 5173
- [x] Axios connected to backend
- [ ] No errors in console (verify by running both)

---

**Day 1**: Project setup with frontend and backend initialized
