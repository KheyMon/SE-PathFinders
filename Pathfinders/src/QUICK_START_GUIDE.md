# PathFinder Backend - Quick Start Guide

## 🚀 Get Started in 5 Steps

### Step 1: Install PHP Server (XAMPP Recommended)

1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP on your computer
3. Start Apache and MySQL from XAMPP Control Panel

### Step 2: Create the Database

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" to create a database
3. Name it: `pathfinder`
4. Click "SQL" tab
5. Copy and paste the entire SQL schema from `BACKEND_INTEGRATION_GUIDE.md` section 1
6. Click "Go" to execute

### Step 3: Create Backend Folder Structure

In your XAMPP installation folder (usually `C:\xampp\htdocs\`):

```
htdocs/
└── pathfinder/
    └── backend/
        ├── config/
        │   ├── database.php
        │   └── cors.php
        └── api/
            ├── auth/
            │   ├── login.php
            │   ├── register.php
            │   └── logout.php
            ├── jobs/
            │   ├── list.php
            │   ├── create.php
            │   ├── delete.php
            │   └── my-jobs.php
            ├── applications/
            │   ├── apply.php
            │   ├── list.php
            │   ├── my-applications.php
            │   └── update-status.php
            ├── lessons/
            │   ├── list.php
            │   ├── create.php
            │   ├── delete.php
            │   └── my-lessons.php
            ├── notifications/
            │   ├── list.php
            │   ├── mark-read.php
            │   └── mark-all-read.php
            └── users/
                ├── profile.php
                └── update.php
```

### Step 4: Create PHP Files

Copy the PHP code from `BACKEND_INTEGRATION_GUIDE.md` into the corresponding files:

**Essential files to create first:**
1. `config/database.php` - Database connection
2. `config/cors.php` - CORS headers
3. `api/auth/register.php` - User registration
4. `api/auth/login.php` - User login
5. `api/jobs/list.php` - Get all jobs

### Step 5: Update React App

1. The API service is already created at `/services/api.js`
2. Update the `API_BASE_URL` in `/services/api.js` if needed:
   ```javascript
   const API_BASE_URL = 'http://localhost/pathfinder/backend/api';
   ```

---

## 📝 Example: Connecting Login Page

Here's how to update your `LoginPage.tsx` to use the backend:

```javascript
import api from '../services/api';

// In your handleLogin function:
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const result = await api.login(email, password);
    
    if (result.user) {
      setUser(result.user);
      setCurrentPage(result.user.type === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
    console.error('Login error:', error);
  }
};
```

---

## 📝 Example: Connecting Job Listings

Update your `JobListings.tsx` to fetch jobs from backend:

```javascript
import { useEffect } from 'react';
import api from '../services/api';

export function JobListings() {
  const { jobs, setJobs } = useApp();
  
  // Fetch jobs when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await api.getAllJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Rest of your component...
}
```

---

## 🧪 Testing Your Setup

### Test 1: Check Backend is Running
Open in browser: `http://localhost/pathfinder/backend/api/jobs/list.php`
- Should return: `[]` (empty array) or list of jobs

### Test 2: Test Registration
1. Go to your React app
2. Click "Register"
3. Fill in the form
4. Submit
5. Check if you're redirected to dashboard

### Test 3: Test Login
1. Use the credentials you just registered
2. Click "Login"
3. Enter email and password
4. Should redirect to dashboard

### Test 4: Check Database
1. Open phpMyAdmin
2. Click on `pathfinder` database
3. Click on `users` table
4. You should see your registered user

---

## 🔧 Common Issues & Solutions

### Issue 1: "Connection refused" or "Failed to fetch"
**Problem**: Backend server not running
**Solution**: 
- Start Apache in XAMPP Control Panel
- Verify URL is correct: `http://localhost/pathfinder/backend/api`

### Issue 2: "CORS policy" error
**Problem**: CORS not configured properly
**Solution**:
- Make sure `config/cors.php` is included at the top of every PHP file
- Check that you're using `credentials: 'include'` in API calls

### Issue 3: "Access denied for user" database error
**Problem**: Wrong database credentials
**Solution**:
- Open `config/database.php`
- Update username (usually 'root')
- Update password (usually empty for XAMPP)

### Issue 4: 404 Not Found for PHP files
**Problem**: PHP files in wrong location
**Solution**:
- Files should be in: `C:\xampp\htdocs\pathfinder\backend\`
- URL should be: `http://localhost/pathfinder/backend/api/...`

### Issue 5: JSON parse error
**Problem**: PHP returning HTML error instead of JSON
**Solution**:
- Check PHP error logs in XAMPP
- Look for syntax errors in PHP files
- Enable error reporting temporarily:
  ```php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  ```

---

## 📂 Required PHP Files (Minimum to Get Started)

### Priority 1: Authentication & Core
- [x] `config/database.php`
- [x] `config/cors.php`
- [x] `api/auth/register.php`
- [x] `api/auth/login.php`
- [x] `api/jobs/list.php`

### Priority 2: Job Seeker Features
- [ ] `api/jobs/list.php`
- [ ] `api/applications/apply.php`
- [ ] `api/applications/my-applications.php`
- [ ] `api/lessons/list.php`

### Priority 3: Employer Features
- [ ] `api/jobs/create.php`
- [ ] `api/jobs/my-jobs.php`
- [ ] `api/jobs/delete.php`
- [ ] `api/applications/list.php`
- [ ] `api/applications/update-status.php`
- [ ] `api/lessons/create.php`
- [ ] `api/lessons/my-lessons.php`

### Priority 4: Additional Features
- [ ] `api/notifications/list.php`
- [ ] `api/notifications/mark-read.php`
- [ ] `api/users/profile.php`
- [ ] `api/users/update.php`

---

## 🎯 Integration Checklist

- [ ] XAMPP installed and running
- [ ] Database `pathfinder` created
- [ ] All tables created using SQL schema
- [ ] Backend folder structure created
- [ ] `config/database.php` created and configured
- [ ] `config/cors.php` created
- [ ] At least `register.php` and `login.php` created
- [ ] API service file exists at `/services/api.js`
- [ ] API_BASE_URL updated in api.js
- [ ] Test registration in React app
- [ ] Test login in React app
- [ ] Check user appears in database

---

## 🆘 Need Help?

1. **Check PHP Errors**: Look in `C:\xampp\apache\logs\error.log`
2. **Check Browser Console**: Look for JavaScript errors
3. **Check Network Tab**: See what requests are being sent
4. **Test Backend Directly**: Visit PHP URLs in browser to see raw response

---

## 📚 Next Steps After Setup

1. ✅ Get authentication working (login/register)
2. ✅ Connect job listings
3. ✅ Connect job applications
4. ✅ Connect employer job posting
5. ✅ Connect lessons system
6. ✅ Connect notifications
7. ✅ Add profile editing

---

Good luck! You've got this! 🚀
