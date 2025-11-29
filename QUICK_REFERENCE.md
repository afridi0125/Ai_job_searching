# Quick Reference Guide

## 🚀 Getting Started (60 seconds)

### 1. Install & Run
```bash
npm install
npm run dev
# Open http://localhost:8080
```

### 2. Sign Up (Candidate)
- Email: `candidate@example.com`
- Password: Any password
- **Data**: Stored locally per user

### 3. Build ATS Resume
1. Go to profile section
2. Click "+ Build ATS Resume"
3. Fill in form (Full Name, Email, etc.)
4. Click "Generate ATS Resume"
5. Resume appears in resume section

### 4. Get Hired
1. Upload a resume (parses skills)
2. Browse jobs (see match %)
3. Apply for jobs
4. Switch to recruiter view
5. Click "Mark Selected" on application
6. Back to candidate → See "Hired By" in profile ✅

---

## 📁 File Structure

```
Src/
├── pages/
│   ├── Auth.tsx           ← Signup/Login
│   ├── Candidate.tsx      ← Main dashboard (Jobs, Profile, ATS Builder)
│   ├── Recruiter.tsx      ← Admin dashboard (Applications, Post Jobs)
│   ├── Index.tsx          ← Landing page
│   └── NotFound.tsx       ← 404 page
├── lib/
│   └── applicationStore.ts ← All business logic & storage
├── components/
│   ├── Navigation.tsx     ← Header navigation
│   ├── NavLink.tsx        ← Nav links
│   └── ui/                ← shadcn components
└── hook/
    └── use-toast.ts       ← Toast notifications
```

---

## 🔑 Key Functions

### Authentication
```typescript
registerUser(email, password)           // Create account
authenticateUser(email, password)       // Login
logoutUser()                           // Logout
getCurrentUserId()                     // Get current user ID
```

### ATS Resume
```typescript
generateATSResume(candidateId, resumeData)  // Create & store
getATSResumes(candidateId)                 // Retrieve all
formatATSResume(resume)                    // Format for display
```

### Job Matching
```typescript
parseResumeText(text)              // Extract skills
calculateJobMatch(job, skills)     // Get match %
saveParsedResume(candidateId, text) // Store parsed data
```

### Applications
```typescript
addApplication(data)               // Submit application
getApplications()                  // Get all applications
markApplicationAsHired(appId, recruiterName) // Hire candidate
```

---

## 💾 Storage Keys

```javascript
// User data
localStorage.getItem('talent_match_current_user')  // Current user session
localStorage.getItem('talent_match_users')         // All users

// Application data
localStorage.getItem('talent_match_applications')  // All applications
localStorage.getItem('talent_match_ats_resumes')   // ATS resumes
localStorage.getItem('talent_match_jobs')          // Job postings

// User profiles
localStorage.getItem('talent_match_user_profiles') // Profile data
```

---

## 🎯 Common Tasks

### Task: Create New Candidate Account
```
1. Click "Sign Up" on Auth page
2. Enter email and password
3. Click "Sign Up" button
4. Redirected to candidate dashboard
```

### Task: Upload Resume
```
1. Go to profile section
2. Click "Upload Resume" button
3. Select .pdf, .doc, or .docx file
4. Skills automatically extracted
5. Job match % updates on all jobs
```

### Task: Build ATS Resume
```
1. Click "+ Build ATS Resume" button
2. Fill form:
   - Full Name (required)
   - Email (required)
   - Phone
   - Location
   - Summary
   - Skills (comma-separated)
3. Click "Generate ATS Resume"
4. Green card appears in resume section
```

### Task: Apply for Job
```
1. Find job in jobs section
2. See match % on card
3. Click job → View Details
4. Select resume
5. Click "Apply" button
6. Application submitted ✓
```

### Task: Hire Candidate (Recruiter)
```
1. Go to Recruiter dashboard
2. View application from candidate
3. Click "Mark Selected" button
4. Candidate now has "Hired By" section
```

### Task: View Who Hired Me
```
1. Go to candidate profile
2. Look for "✅ Hired By" section
3. See company name and position
4. See recruiter name who hired
```

---

## 🎨 UI Components

### States & Status
- **New**: Initial application state
- **Reviewing**: Under review
- **Shortlisted**: Passed initial screen
- **Selected**: Candidate hired ✅
- **Rejected**: Application rejected ❌

### Colors Used
- **Blue**: Primary actions, job cards
- **Green**: Success, hired status
- **Red**: Danger, reject actions
- **Gray**: Neutral, secondary

---

## 🔍 Debugging

### Check Current User
```javascript
console.log(localStorage.getItem('talent_match_current_user'))
```

### View All Applications
```javascript
console.log(localStorage.getItem('talent_match_applications'))
```

### Clear Data
```javascript
localStorage.clear()  // Clear ALL data (careful!)
```

### Check if Authenticated
```javascript
const currentUser = JSON.parse(localStorage.getItem('talent_match_current_user') || '{}')
console.log('Logged in as:', currentUser.email)
```

---

## 📊 Data Flow

```
Sign Up → Candidate Dashboard → Upload Resume → Parse Skills → 
Browse Jobs (see match %) → Apply → Recruiter View → Mark Hired → 
Candidate Sees "Hired By" ✅
```

---

## ⚠️ Important Notes

1. **Data Storage**: All data stored in browser localStorage
   - Data cleared if localStorage is cleared
   - Different browsers = different data
   - No backend needed for local testing

2. **User Isolation**: Each login has separate data
   - Login as User A → See their data
   - Logout → Login as User B → See different data
   - Data persists across sessions

3. **ATS Resume**: 
   - Not downloaded as file (can be extended)
   - Stored as formatted text
   - Can be copied/pasted

4. **Job Matching**:
   - Based on skill overlap
   - Formula: (matching skills / job required skills) * 100
   - Updates when resume is uploaded

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not persisting | Check localStorage is enabled in browser |
| Can't login | Email/password case-sensitive, check signup first |
| ATS modal not opening | Check console for errors, refresh page |
| No job matches | Upload resume to extract skills first |
| Can't mark as hired | Check if logged in as recruiter |

---

## 📱 Responsive Design

- **Desktop**: Full 3-column layout
- **Tablet**: 2-column layout
- **Mobile**: Single column with dropdowns
- All modals are mobile-friendly

---

## 🎓 Learning Resources

### For Candidates
- 📖 Portfolio section → Add projects
- 🎯 Competitions → Take quizzes
- 📚 Events → Register for workshops
- 💬 Chat → Ask questions

### For Recruiters
- 📊 Dashboard → View statistics
- 👥 Applications → Manage candidates
- 💼 Jobs → Post new positions
- ✅ Hiring → Mark candidates as selected

---

## 🚀 What's Next?

- **Deploy**: Build and deploy to Netlify/Vercel
- **Backend**: Connect to Firebase/MongoDB
- **Features**: Add PDF download, email integration
- **Analytics**: Track applications and hiring

---

**Last Updated**: November 29, 2025
**Version**: 2.0 (Complete Hiring System)
