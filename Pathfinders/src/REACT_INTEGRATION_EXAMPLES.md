# React Integration Examples
## How to Connect Your Components to the Backend

**IMPORTANT: These changes will NOT affect your UI - only the data flow!**

---

## 📋 What You'll Do

For each component, you'll:
1. Import the API service
2. Replace local state updates with API calls
3. Add error handling
4. Everything else stays the same!

---

## 🔐 Example 1: LoginPage

### Current Code (lines that need updating):

```javascript
// Find this in your LoginPage.tsx:
const handleLogin = (e) => {
  e.preventDefault();
  
  // Current code probably just sets the user directly
  setUser({
    id: '1',
    name: email.split('@')[0],
    email,
    type: userType
  });
  setCurrentPage(userType === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
};
```

### Updated Code:

```javascript
import api from '../services/api'; // ADD THIS AT TOP

// Replace the handleLogin function:
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

**What changed?**
- Added `async` to function
- Added `await api.login()`
- Added error handling
- UI stays exactly the same!

---

## 🔐 Example 2: RegisterPage

### Current Code:

```javascript
const handleRegister = (e) => {
  e.preventDefault();
  
  // Current code sets user directly
  setUser({
    id: String(Date.now()),
    name,
    email,
    type: userType,
    company: userType === 'employer' ? company : null
  });
  setCurrentPage(userType === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
};
```

### Updated Code:

```javascript
import api from '../services/api'; // ADD THIS AT TOP

const handleRegister = async (e) => {
  e.preventDefault();
  
  try {
    const result = await api.register({
      name,
      email,
      password,
      user_type: userType,
      company: userType === 'employer' ? company : null
    });
    
    if (result.user) {
      setUser(result.user);
      setCurrentPage(result.user.type === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
    } else {
      alert(result.message || 'Registration failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
    console.error('Register error:', error);
  }
};
```

---

## 💼 Example 3: JobListings

### Add at the top:

```javascript
import { useEffect } from 'react'; // If not already imported
import api from '../services/api';
```

### Add this useEffect to fetch jobs when component loads:

```javascript
export function JobListings() {
  const { jobs, setJobs, user } = useApp();
  
  // ADD THIS:
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
  
  // Rest of your component stays the same
  // All your existing JSX, filtering, search etc.
}
```

**What this does:**
- Loads jobs from database when page opens
- Updates the `jobs` state
- Your existing UI code displays them automatically!

---

## 💼 Example 4: Applying for Jobs

### In JobListings.tsx, find the apply button:

```javascript
// Current code (wherever you apply):
const handleApply = (jobId) => {
  const newApplication = {
    id: String(Date.now()),
    jobId: jobId,
    applicantId: user.id,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };
  setApplications([...applications, newApplication]);
  alert('Application submitted!');
};
```

### Updated Code:

```javascript
import api from '../services/api'; // AT TOP

const handleApply = async (jobId) => {
  try {
    const result = await api.applyForJob(jobId);
    
    if (result.message) {
      alert(result.message);
      
      // Refresh applications
      const updatedApplications = await api.getMyApplications();
      setApplications(updatedApplications);
    }
  } catch (error) {
    alert('Failed to apply. Please try again.');
    console.error('Apply error:', error);
  }
};
```

---

## 📊 Example 5: Application Status Page

### Add useEffect to load applications:

```javascript
import { useEffect } from 'react';
import api from '../services/api';

export function ApplicationStatus() {
  const { applications, setApplications, user } = useApp();
  
  // ADD THIS:
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await api.getMyApplications();
        setApplications(applicationsData);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    };
    
    fetchApplications();
  }, []);
  
  // Your existing UI code stays the same
}
```

---

## 💼 Example 6: PostJob (Employer)

### Update the submit handler:

```javascript
import api from '../services/api';

// Current code:
const handleSubmit = (e) => {
  e.preventDefault();
  
  const newJob = {
    id: String(Date.now()),
    title,
    company,
    location,
    type: jobType,
    salary,
    description,
    requirements,
    skills: skills.split(',').map(s => s.trim()),
    postedDate: new Date().toISOString().split('T')[0],
    postedBy: user.id
  };
  
  setJobs([...jobs, newJob]);
  alert('Job posted successfully!');
  setCurrentPage('manage-jobs');
};
```

### Updated Code:

```javascript
import api from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const result = await api.createJob({
      title,
      company,
      location,
      type: jobType,
      salary,
      description,
      requirements,
      skills: skills.split(',').map(s => s.trim())
    });
    
    if (result.message) {
      alert(result.message);
      
      // Refresh jobs list
      const updatedJobs = await api.getMyJobs();
      setJobs(updatedJobs);
      
      setCurrentPage('manage-jobs');
    }
  } catch (error) {
    alert('Failed to post job. Please try again.');
    console.error('Post job error:', error);
  }
};
```

---

## 🗑️ Example 7: Delete Job (Employer)

```javascript
import api from '../services/api';

const handleDeleteJob = async (jobId) => {
  if (window.confirm('Are you sure you want to delete this job?')) {
    try {
      const result = await api.deleteJob(jobId);
      
      if (result.message) {
        alert(result.message);
        
        // Refresh jobs list
        const updatedJobs = await api.getMyJobs();
        setJobs(updatedJobs);
      }
    } catch (error) {
      alert('Failed to delete job. Please try again.');
      console.error('Delete job error:', error);
    }
  }
};
```

---

## 👥 Example 8: View Applicants (Employer)

```javascript
import { useEffect } from 'react';
import api from '../services/api';

export function ViewApplicants() {
  const { applications, setApplications } = useApp();
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await api.getAllApplicationsForEmployer();
        setApplications(applicationsData);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    };
    
    fetchApplications();
  }, []);
  
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const result = await api.updateApplicationStatus(applicationId, status);
      
      if (result.message) {
        alert(result.message);
        
        // Refresh applications
        const updatedApplications = await api.getAllApplicationsForEmployer();
        setApplications(updatedApplications);
      }
    } catch (error) {
      alert('Failed to update status. Please try again.');
      console.error('Update status error:', error);
    }
  };
  
  // Your existing UI code
}
```

---

## 📚 Example 9: Create Lesson (Employer)

```javascript
import api from '../services/api';

const handleCreateLesson = async (e) => {
  e.preventDefault();
  
  try {
    const result = await api.createLesson({
      title,
      description,
      content,
      visibility: 'public'
    });
    
    if (result.message) {
      alert(result.message);
      
      // Refresh lessons
      const updatedLessons = await api.getMyLessons();
      setEmployerLessons(updatedLessons);
      
      setCurrentPage('manage-lessons');
    }
  } catch (error) {
    alert('Failed to create lesson. Please try again.');
    console.error('Create lesson error:', error);
  }
};
```

---

## 🔔 Example 10: Load Notifications

### In Header.tsx or wherever notifications are displayed:

```javascript
import { useEffect } from 'react';
import api from '../services/api';

// Add this useEffect:
useEffect(() => {
  const fetchNotifications = async () => {
    if (user) {
      try {
        const notificationsData = await api.getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }
  };
  
  fetchNotifications();
  
  // Optional: Refresh every 30 seconds
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, [user]);
```

---

## 🎯 Integration Pattern (Copy This!)

For **ANY** component that needs backend data:

```javascript
// 1. Import at top
import { useEffect } from 'react';
import api from '../services/api';

// 2. Add useEffect to load data
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await api.someMethod();
      setSomeState(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  fetchData();
}, []);

// 3. For actions (create, update, delete)
const handleAction = async () => {
  try {
    const result = await api.someAction(data);
    
    if (result.message) {
      alert(result.message);
      
      // Refresh data
      const updatedData = await api.someMethod();
      setSomeState(updatedData);
    }
  } catch (error) {
    alert('Action failed. Please try again.');
    console.error('Error:', error);
  }
};
```

---

## ✅ Testing Checklist

After integrating each component, test:

1. **Register** → Should see user in database
2. **Login** → Should log in with database credentials
3. **Job Listings** → Should load from database
4. **Apply for Job** → Should save to database
5. **Post Job (Employer)** → Should save to database
6. **Manage Jobs** → Should load employer's jobs
7. **View Applicants** → Should show applications
8. **Update Status** → Should update in database
9. **Create Lesson** → Should save to database
10. **Notifications** → Should load from database

---

## 🛡️ Important Notes

### ✅ What Changes:
- Data now comes from MySQL database
- Actions save to database
- Data persists across page refreshes
- Multiple users can use the system

### ❌ What Doesn't Change:
- Your UI/components stay the same
- CSS/styling stays the same
- Layout stays the same
- User experience stays the same

### 🔒 Security:
- Passwords are hashed
- Sessions used for authentication
- SQL injection prevented
- Only authorized users can access data

---

## 🚀 Quick Start Order

Integrate in this order for easiest testing:

1. ✅ **LoginPage** - Test login
2. ✅ **RegisterPage** - Test registration
3. ✅ **JobListings** - Load jobs
4. ✅ **PostJob** - Create jobs (test with employer account)
5. ✅ **Apply for Jobs** - Test applications
6. ✅ **ApplicationStatus** - View your applications
7. ✅ **ViewApplicants** - Employer views applications
8. ✅ **Update Application Status** - Employer accepts/rejects
9. ✅ **Lessons** - Create and view lessons
10. ✅ **Notifications** - Load notifications

---

Need help with a specific component? Just ask! 🎯
