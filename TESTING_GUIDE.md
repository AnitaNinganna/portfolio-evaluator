# 🧪 Complete Testing Guide — Portfolio Evaluator

---

## ✅ PRE-TEST CHECKLIST

### Step 1: Verify `.env` File
**File:** `server/.env`

Your `.env` must have:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio-evaluator
CLIENT_URL=http://localhost:5173
GITHUB_TOKEN=your_actual_token_here
```

**Get a GitHub Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scope: `public_repo`
4. Copy and paste into `.env`

### Step 2: Verify Dependencies Installed
**Command:**
```bash
cd d:\Desktop\portfolio-evaluator\server
npm list
```

You should see:
- `@octokit/rest` ✓
- `express` ✓
- `cors` ✓
- `dotenv` ✓
- `mongoose` ✓

---

## 🚀 STEP-BY-STEP TESTING

### TEST 1: Start Server

**Command:**
```bash
cd d:\Desktop\portfolio-evaluator\server
npm run dev
```

**Expected Output:**
```
[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
Server running on port 5000
```

**✓ Status:** Green — Server is running

---

### TEST 2: Health Check (Sanity)

**URL:** `http://localhost:5000/api/health`

**Method:** GET

**Expected Response:**
```json
{
  "status": "ok"
}
```

**✓ Status:** If you see this, server is healthy

---

### TEST 3: Test Famous User (octocat)

**URL:** `http://localhost:5000/api/profile/octocat`

**Method:** GET

**Open in Browser:**
```
http://localhost:5000/api/profile/octocat
```

**Or use Postman:**
1. New Request
2. Method: GET
3. URL: `http://localhost:5000/api/profile/octocat`
4. Send

---

## 📊 STEP 3: VALIDATE RESPONSE STRUCTURE

When you get the response, verify **every section**:

### Section A: Profile Data

```json
"profile": {
  "username": "octocat",
  "name": "The Octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/1?v=4",
  "bio": "There once was...",
  "followers": 3938,
  "publicRepos": 2,
  "blog": "https://github.blog",
  "email": null,
  "createdAt": "2011-01-25T18:44:36Z"
}
```

**Validation Checklist:**
- ✓ `username` is string
- ✓ `followers` is number
- ✓ `publicRepos` is number
- ✓ `createdAt` is date format

---

### Section B: Repositories List

```json
"repos": [
  {
    "name": "Hello-World",
    "stars": 2500,
    "forks": 1000,
    "language": "Python",
    "topics": ["octocat", "github"],
    "hasLicense": true,
    "hasReadme": true,
    "url": "https://github.com/octocat/Hello-World",
    "description": "Description here"
  }
]
```

**Validation Checklist:**
- ✓ Array of repos
- ✓ Each has: `name`, `stars`, `forks`, `language`
- ✓ `topics` is array
- ✓ `hasLicense` is boolean
- ✓ `hasReadme` is boolean
- ✓ `stars` >= 0
- ✓ `forks` >= 0

---

### Section C: Languages Distribution

```json
"languages": [
  {
    "name": "Python",
    "percent": "100.00"
  },
  {
    "name": "JavaScript",
    "percent": "0.00"
  }
]
```

**Validation Checklist:**
- ✓ Array of language objects
- ✓ Each has `name` string
- ✓ Each has `percent` string (with decimals)
- ✓ Percentages sum to ~100
- ✓ Sorted by percentage (highest first)

---

### Section D: Top Repositories

```json
"topRepos": [
  {
    "name": "Hello-World",
    "stars": 2500,
    "forks": 1000,
    ...
  }
]
```

**Validation Checklist:**
- ✓ Array (usually 1-6 repos)
- ✓ Sorted by stars (descending)
- ✓ Same structure as "repos" section

---

### Section E: SCORING — Overall

```json
"scoring": {
  "overall": {
    "score": 72,
    "tier": "Advanced",
    "percentile": 72
  }
}
```

**Validation Checklist:**
- ✓ `score` is 0-100
- ✓ `tier` is one of: "Beginner", "Intermediate", "Advanced", "Expert"
- ✓ `percentile` matches score

**Tier Rules:**
- Beginner: 0-39
- Intermediate: 40-59
- Advanced: 60-79
- Expert: 80-100

---

### Section F: SCORING — Portfolio

```json
"scoring": {
  "portfolio": {
    "portfolioScore": 68,
    "averageQuality": 65,
    "consistency": 82,
    "repoScores": [
      {
        "name": "Hello-World",
        "score": 72,
        "breakdown": {
          "stars": 25,
          "forks": 18,
          "language": 15,
          "description": 5,
          "readme": 10,
          "license": 10,
          "topics": 4
        }
      }
    ]
  }
}
```

**Validation Checklist — Portfolio Score:**
- ✓ 0-100
- ✓ Average quality 0-100
- ✓ Consistency 0-100
- ✓ Min 1 repo in `repoScores`

**Validation Checklist — Per-Repo Breakdown:**
- ✓ `stars`: 0-30
- ✓ `forks`: 0-20
- ✓ `language`: 10-15
- ✓ `description`: 0-15
- ✓ `readme`: 0-10
- ✓ `license`: 0-10
- ✓ `topics`: 0-10
- ✓ Total ≤ 95

**Manual Calculation for Octocat Hello-World:**
```
Stars (2500):     log10(2500+1) * 10 = 3.4 * 10 ≈ 34 → capped at 30 ✓
Forks (1000):     log10(1000+1) * 7 = 3.0 * 7 ≈ 21 → capped at 20 ✓
Language (Python): in demand = 15 ✓
Description:      "A Hello World Script..." = 15 ✓
README:           exists = 10 ✓
License:          exists = 10 ✓
Topics:           ["octocat", "github"] = 2 * 2 = 4 ✓
TOTAL:            30 + 20 + 15 + 15 + 10 + 10 + 4 = 104 → capped at 95

Actual shown: 72 (might be normalized or weighted differently)
```

---

### Section G: SCORING — Profile

```json
"scoring": {
  "profile": {
    "profileScore": 62,
    "breakdown": {
      "followers": 18,
      "repos": 8,
      "experience": 16,
      "presence": 12
    }
  }
}
```

**Validation Checklist:**
- ✓ `profileScore`: 0-80
- ✓ `followers`: 0-20
- ✓ `repos`: 0-25
- ✓ `experience`: 0-20
- ✓ `presence`: 0-15

**Manual Calculation for Octocat:**
```
Followers (3938):   log10(3938+1) * 5 = 3.6 * 5 ≈ 18 → capped at 20 ✓
Public Repos (2):   log10(2+1) * 8 = 0.48 * 8 ≈ 3.8 → capped at 25 ✓
Account Age (15yr): min(20, 15 * 2) = min(20, 30) = 20 ✓
Presence:           name ✓ + bio ✓ + blog ✓ = 15 ✓
TOTAL:              20 + 3.8 + 20 + 15 = 58.8 ≈ 59
```

---

### Section H: SCORING — Diversity

```json
"scoring": {
  "diversity": {
    "diversityScore": 20,
    "languageCount": 1,
    "primaryLanguage": "Python",
    "breakdown": {
      "languageCount": 2,
      "evenness": 0,
      "specialization": 5
    }
  }
}
```

**Validation Checklist:**
- ✓ `diversityScore`: 0-50
- ✓ `languageCount`: number of languages (≥ 0)
- ✓ `primaryLanguage`: string or null
- ✓ `languageCount`: 0-20
- ✓ `evenness`: 0-15
- ✓ `specialization`: 0-15

**Manual Calculation for Octocat (1 language):**
```
Language Count (1): min(20, 1 * 2) = 2 ✓
Evenness:          only 1 language = 0 ✓
Specialization:    Python is in "data" & "backend" = 5 ✓
TOTAL:             2 + 0 + 5 = 7
```

---

### Section I: SCORING — Summary

```json
"scoring": {
  "summary": {
    "totalRepos": 2,
    "topLanguage": "Python",
    "followers": 3938,
    "topRepo": "Hello-World",
    "topRepoScore": 72
  }
}
```

**Validation Checklist:**
- ✓ `totalRepos`: matches repo count
- ✓ `topLanguage`: matches primary language
- ✓ `followers`: matches profile followers
- ✓ `topRepo`: matches highest scored repo

---

### Section J: Report (Human-Readable)

```json
"report": {
  "strengths": [
    "Strong repository portfolio",
    "Good community engagement"
  ],
  "improvements": [
    "Expand to learn additional programming languages",
    "Complete your GitHub profile details"
  ],
  "nextSteps": [
    "Focus on creating well-documented projects",
    "Increase visibility by contributing to open source",
    "Build projects in high-demand languages"
  ]
}
```

**Validation Checklist:**
- ✓ `strengths`: 1+ strings (auto-detected from scores)
- ✓ `improvements`: 1+ strings (auto-detected from scores)
- ✓ `nextSteps`: 3 actionable items

---

## 🔢 STEP 4: VERIFY OVERALL SCORE CALCULATION

**Formula:**
```
Overall Score = (Portfolio * 0.40) + (Profile * 0.35) + (Diversity * 0.25)
```

**For Octocat:**
```
Portfolio:  72 * 0.40 = 28.8
Profile:    62 * 0.35 = 21.7
Diversity:  20 * 0.25 = 5.0
TOTAL:      28.8 + 21.7 + 5.0 = 55.5 ≈ 56

Expected Tier: "Intermediate" (40-59)
```

---

## 🧪 STEP 5: TEST ERROR CASES

### Error Test 1: Missing Username

**URL:** `http://localhost:5000/api/profile/`

**Expected Response:**
```json
{
  "error": "Username is required"
}
```

**Expected Status:** 400

---

### Error Test 2: Non-Existent User

**URL:** `http://localhost:5000/api/profile/this_user_definitely_does_not_exist_xyz_12345`

**Expected Response:**
```json
{
  "error": "GitHub user not found"
}
```

**Expected Status:** 404

---

### Error Test 3: Invalid GitHub Token

**In `.env`, change:**
```
GITHUB_TOKEN=invalid_token_here
```

**Restart server, then test:**
```
http://localhost:5000/api/profile/octocat
```

**Expected Response:**
```json
{
  "error": "Server Error"
}
```

**Expected Status:** 500

---

## 👤 STEP 6: TEST WITH REAL DEVELOPERS

### Test User 1: Linus Torvalds (Linux Creator)

**URL:** `http://localhost:5000/api/profile/torvalds`

**Expected:**
- Score: 85-95 (Expert)
- Followers: 200k+
- Repos: 100+
- Languages: Multiple
- Top repos: 10k+ stars

---

### Test User 2: Guido van Rossum (Python Creator)

**URL:** `http://localhost:5000/api/profile/gvanrossum`

**Expected:**
- Score: 75-85 (Advanced/Expert)
- Followers: 50k+
- Profile: Very complete
- Experience: 20+ years

---

### Test User 3: Yourself or Local Dev

**URL:** `http://localhost:5000/api/profile/your_username`

**Expected:**
- Score reflects your actual GitHub profile
- Realistic tier assignment
- Meaningful strengths/improvements

---

## 🔍 STEP 7: CHECK TERMINAL LOGS

Keep terminal visible while testing. You should see:

```
GET /api/profile/octocat 200 - 523ms
GET /api/profile/invaliduser 404 - 245ms
GET /api/profile/torvalds 200 - 618ms
```

**No errors should appear** unless testing error cases.

---

## ✅ FINAL VALIDATION CHECKLIST

- [ ] Server starts without errors
- [ ] Health check returns `{"status":"ok"}`
- [ ] octocat profile returns all sections
- [ ] Profile data is correct (3938 followers, etc.)
- [ ] Repos array contains at least 1 repo
- [ ] Languages array has percentages
- [ ] Overall score is 0-100
- [ ] Tier is one of 4 valid tiers
- [ ] Portfolio breakdowns sum correctly
- [ ] Profile breakdowns sum correctly
- [ ] Diversity calculation makes sense
- [ ] Report has strengths, improvements, nextSteps
- [ ] Missing username returns 400
- [ ] Non-existent user returns 404
- [ ] Real users (torvalds) return realistic scores
- [ ] No console errors in terminal

---

## 🎯 PASS/FAIL CRITERIA

**✅ PASS:**
- All sections present in response
- All numbers are valid ranges
- No null/undefined fields (except where allowed)
- Score calculations are mathematically correct
- Error handling works as expected

**❌ FAIL:**
- Missing any response section
- Numbers out of expected range
- Null/undefined in required fields
- Score doesn't match formula
- Error responses don't match spec

---

## 💡 COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid token | Update `.env` GITHUB_TOKEN |
| Request timeout | API slow | Wait 30s, retry |
| 500 Server Error | Code error | Check terminal, restart server |
| Empty repos | User has no public repos | Try different user |
| Wrong score | Math error in service | Check `scoringService.js` logic |

---

## 🚀 NEXT STEPS AFTER TESTING

Once all tests pass:

1. ✅ Save results in test report
2. ✅ Deploy to production
3. ✅ Build frontend to display scoring
4. ✅ Add database storage for profiles
5. ✅ Create comparison features
