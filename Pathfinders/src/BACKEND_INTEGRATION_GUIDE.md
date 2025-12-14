# PathFinder Backend Integration Guide
## PHP & MySQL Implementation

This guide will help you connect your PathFinder React app to a PHP/MySQL backend.

---

## 📋 Table of Contents
1. [Database Schema](#database-schema)
2. [PHP Backend Structure](#php-backend-structure)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Authentication Flow](#authentication-flow)
6. [CORS Setup](#cors-setup)
7. [Security Best Practices](#security-best-practices)

---

## 1. Database Schema

### MySQL Database Setup

```sql
-- Create Database
CREATE DATABASE pathfinder;
USE pathfinder;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('jobseeker', 'employer') NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    salary VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT,
    skills JSON,
    posted_date DATE NOT NULL,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications Table
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    applied_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, applicant_id)
);

-- Lessons Table (Employer-created training modules)
CREATE TABLE lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    visibility ENUM('public', 'assigned') DEFAULT 'public',
    created_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lesson Assignments Table
CREATE TABLE lesson_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (lesson_id, user_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Progress Table (for SkillBuild)
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    module_id VARCHAR(100) NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INT,
    completed_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_lessons_creator ON lessons(creator_id);
```

---

## 2. PHP Backend Structure

### Recommended Folder Structure

```
backend/
├── config/
│   ├── database.php          # Database connection
│   └── cors.php              # CORS headers
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── register.php
│   │   └── logout.php
│   ├── users/
│   │   ├── profile.php
│   │   └── update.php
│   ├── jobs/
│   │   ├── list.php
│   │   ├── create.php
│   │   ├── update.php
│   │   ├── delete.php
│   │   └── my-jobs.php
│   ├── applications/
│   │   ├── apply.php
│   │   ├── list.php
│   │   ├── my-applications.php
│   │   └── update-status.php
│   ├── lessons/
│   │   ├── list.php
│   │   ├── create.php
│   │   ├── delete.php
│   │   └── my-lessons.php
│   └── notifications/
│       ├── list.php
│       ├── mark-read.php
│       └── mark-all-read.php
└── utils/
    ├── jwt.php               # JWT token handling (optional)
    └── helpers.php           # Helper functions
```

---

## 3. API Endpoints

### A. Database Connection (`config/database.php`)

```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "pathfinder";
    private $username = "root";  // Change to your MySQL username
    private $password = "";      // Change to your MySQL password
    public $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}
?>
```

### B. CORS Configuration (`config/cors.php`)

```php
<?php
// Allow requests from your React app
header("Access-Control-Allow-Origin: *"); // Change * to your frontend URL in production
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

### C. Authentication Endpoints

#### Register (`api/auth/register.php`)

```php
<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->user_type)) {
    
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Email already exists"]);
        exit();
    }
    
    // Insert new user
    $query = "INSERT INTO users (name, email, password, user_type, company) 
              VALUES (:name, :email, :password, :user_type, :company)";
    
    $stmt = $db->prepare($query);
    
    // Hash password
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":user_type", $data->user_type);
    
    $company = isset($data->company) ? $data->company : null;
    $stmt->bindParam(":company", $company);
    
    if ($stmt->execute()) {
        $user_id = $db->lastInsertId();
        
        // Return user data (without password)
        $user_query = "SELECT id, name, email, user_type, company FROM users WHERE id = :id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(":id", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->fetch();
        
        // Start session
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = $user['user_type'];
        
        http_response_code(201);
        echo json_encode([
            "message" => "User registered successfully",
            "user" => [
                "id" => (string)$user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "type" => $user['user_type'],
                "company" => $user['company']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to register user"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

#### Login (`api/auth/login.php`)

```php
<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    
    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch();
        
        if (password_verify($data->password, $user['password'])) {
            // Start session
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_type'] = $user['user_type'];
            
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => [
                    "id" => (string)$user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "type" => $user['user_type'],
                    "company" => $user['company']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

### D. Jobs Endpoints

#### List All Jobs (`api/jobs/list.php`)

```php
<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT j.*, u.name as employer_name 
          FROM jobs j 
          LEFT JOIN users u ON j.employer_id = u.id 
          WHERE j.status = 'active'
          ORDER BY j.posted_date DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$jobs = [];
while ($row = $stmt->fetch()) {
    $job = [
        "id" => (string)$row['id'],
        "title" => $row['title'],
        "company" => $row['company'],
        "location" => $row['location'],
        "type" => $row['job_type'],
        "salary" => $row['salary'],
        "description" => $row['description'],
        "requirements" => $row['requirements'],
        "skills" => json_decode($row['skills']),
        "postedDate" => $row['posted_date'],
        "postedBy" => (string)$row['employer_id']
    ];
    array_push($jobs, $job);
}

http_response_code(200);
echo json_encode($jobs);
?>
```

#### Create Job (`api/jobs/create.php`)

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Check authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && !empty($data->description)) {
    
    $query = "INSERT INTO jobs 
              (employer_id, title, company, location, job_type, salary, description, requirements, skills, posted_date) 
              VALUES 
              (:employer_id, :title, :company, :location, :job_type, :salary, :description, :requirements, :skills, :posted_date)";
    
    $stmt = $db->prepare($query);
    
    $employer_id = $_SESSION['user_id'];
    $skills_json = json_encode($data->skills);
    $posted_date = date('Y-m-d');
    
    $stmt->bindParam(":employer_id", $employer_id);
    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":company", $data->company);
    $stmt->bindParam(":location", $data->location);
    $stmt->bindParam(":job_type", $data->type);
    $stmt->bindParam(":salary", $data->salary);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":requirements", $data->requirements);
    $stmt->bindParam(":skills", $skills_json);
    $stmt->bindParam(":posted_date", $posted_date);
    
    if ($stmt->execute()) {
        $job_id = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "message" => "Job created successfully",
            "job_id" => (string)$job_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to create job"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

### E. Applications Endpoints

#### Apply for Job (`api/applications/apply.php`)

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Check authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'jobseeker') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->job_id)) {
    
    // Check if already applied
    $check_query = "SELECT id FROM applications WHERE job_id = :job_id AND applicant_id = :applicant_id";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":job_id", $data->job_id);
    $check_stmt->bindParam(":applicant_id", $_SESSION['user_id']);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Already applied to this job"]);
        exit();
    }
    
    $query = "INSERT INTO applications (job_id, applicant_id, applied_date) 
              VALUES (:job_id, :applicant_id, :applied_date)";
    
    $stmt = $db->prepare($query);
    
    $applied_date = date('Y-m-d');
    
    $stmt->bindParam(":job_id", $data->job_id);
    $stmt->bindParam(":applicant_id", $_SESSION['user_id']);
    $stmt->bindParam(":applied_date", $applied_date);
    
    if ($stmt->execute()) {
        $application_id = $db->lastInsertId();
        
        // Create notification for employer
        $job_query = "SELECT employer_id, title, company FROM jobs WHERE id = :job_id";
        $job_stmt = $db->prepare($job_query);
        $job_stmt->bindParam(":job_id", $data->job_id);
        $job_stmt->execute();
        $job = $job_stmt->fetch();
        
        $user_query = "SELECT name FROM users WHERE id = :user_id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(":user_id", $_SESSION['user_id']);
        $user_stmt->execute();
        $user = $user_stmt->fetch();
        
        $notif_query = "INSERT INTO notifications (user_id, type, title, message) 
                        VALUES (:user_id, 'application', :title, :message)";
        $notif_stmt = $db->prepare($notif_query);
        $notif_title = "New Application";
        $notif_message = $user['name'] . " applied for " . $job['title'];
        $notif_stmt->bindParam(":user_id", $job['employer_id']);
        $notif_stmt->bindParam(":title", $notif_title);
        $notif_stmt->bindParam(":message", $notif_message);
        $notif_stmt->execute();
        
        http_response_code(201);
        echo json_encode([
            "message" => "Application submitted successfully",
            "application_id" => (string)$application_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to submit application"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

#### Get My Applications (`api/applications/my-applications.php`)

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$query = "SELECT a.*, j.title, j.company, u.name as applicant_name
          FROM applications a
          LEFT JOIN jobs j ON a.job_id = j.id
          LEFT JOIN users u ON a.applicant_id = u.id
          WHERE a.applicant_id = :user_id
          ORDER BY a.applied_date DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $_SESSION['user_id']);
$stmt->execute();

$applications = [];
while ($row = $stmt->fetch()) {
    $application = [
        "id" => (string)$row['id'],
        "jobId" => (string)$row['job_id'],
        "applicantId" => (string)$row['applicant_id'],
        "applicantName" => $row['applicant_name'],
        "appliedDate" => $row['applied_date'],
        "status" => $row['status']
    ];
    array_push($applications, $application);
}

http_response_code(200);
echo json_encode($applications);
?>
```

---

## 4. Frontend Integration

### Create API Service File

Create `/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost/pathfinder/backend/api';

class ApiService {
  
  // Auth
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  // Jobs
  async getAllJobs() {
    const response = await fetch(`${API_BASE_URL}/jobs/list.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async createJob(jobData) {
    const response = await fetch(`${API_BASE_URL}/jobs/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(jobData)
    });
    return response.json();
  }

  async getMyJobs() {
    const response = await fetch(`${API_BASE_URL}/jobs/my-jobs.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async deleteJob(jobId) {
    const response = await fetch(`${API_BASE_URL}/jobs/delete.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ job_id: jobId })
    });
    return response.json();
  }

  // Applications
  async applyForJob(jobId) {
    const response = await fetch(`${API_BASE_URL}/applications/apply.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ job_id: jobId })
    });
    return response.json();
  }

  async getMyApplications() {
    const response = await fetch(`${API_BASE_URL}/applications/my-applications.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async getJobApplications(jobId) {
    const response = await fetch(`${API_BASE_URL}/applications/list.php?job_id=${jobId}`, {
      credentials: 'include'
    });
    return response.json();
  }

  async updateApplicationStatus(applicationId, status) {
    const response = await fetch(`${API_BASE_URL}/applications/update-status.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ application_id: applicationId, status })
    });
    return response.json();
  }

  // Lessons
  async getAllLessons() {
    const response = await fetch(`${API_BASE_URL}/lessons/list.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async createLesson(lessonData) {
    const response = await fetch(`${API_BASE_URL}/lessons/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(lessonData)
    });
    return response.json();
  }

  async getMyLessons() {
    const response = await fetch(`${API_BASE_URL}/lessons/my-lessons.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async deleteLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/lessons/delete.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ lesson_id: lessonId })
    });
    return response.json();
  }

  // Notifications
  async getNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications/list.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async markNotificationAsRead(notificationId) {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-read.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ notification_id: notificationId })
    });
    return response.json();
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read.php`, {
      method: 'PUT',
      credentials: 'include'
    });
    return response.json();
  }

  // Profile
  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/users/update.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });
    return response.json();
  }
}

export default new ApiService();
```

---

## 5. Authentication Flow

### Update LoginPage Component

```javascript
import api from '../services/api';

// In handleLogin function:
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
    alert('An error occurred during login');
    console.error(error);
  }
};
```

### Update RegisterPage Component

```javascript
import api from '../services/api';

// In handleRegister function:
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
    alert('An error occurred during registration');
    console.error(error);
  }
};
```

---

## 6. CORS Setup

### PHP CORS Headers (Already in `config/cors.php`)

For development, you can use `*` but for production, specify your frontend URL:

```php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Your React dev server
```

---

## 7. Security Best Practices

### ✅ Implement These Security Measures:

1. **Password Hashing**: ✅ Already using `password_hash()` and `password_verify()`

2. **SQL Injection Prevention**: ✅ Using PDO prepared statements

3. **Session Management**:
```php
// Add to each protected endpoint
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}
```

4. **Input Validation**: Add validation to all endpoints

5. **HTTPS**: Use HTTPS in production (not HTTP)

6. **Environment Variables**: Store database credentials in `.env` file

7. **Rate Limiting**: Implement API rate limiting

8. **XSS Protection**: Sanitize all user inputs before displaying

---

## 🚀 Next Steps

1. **Set up your PHP server** (XAMPP, WAMP, or MAMP)
2. **Create the database** using the SQL schema above
3. **Create the PHP files** in the backend folder structure
4. **Create the API service** in your React app
5. **Update your components** to use the API service
6. **Test the authentication flow**
7. **Implement remaining endpoints**

---

## 📝 Testing Checklist

- [ ] Database created successfully
- [ ] PHP backend running on localhost
- [ ] CORS configured properly
- [ ] Registration works
- [ ] Login works
- [ ] Jobs can be created
- [ ] Jobs can be viewed
- [ ] Applications can be submitted
- [ ] Notifications are created
- [ ] Profile updates work

---

## 🆘 Troubleshooting

**Issue**: CORS errors
- **Solution**: Check CORS headers in `config/cors.php` and ensure `credentials: 'include'` in fetch calls

**Issue**: Session not persisting
- **Solution**: Ensure `credentials: 'include'` in all API calls

**Issue**: Database connection failed
- **Solution**: Check database credentials in `config/database.php`

**Issue**: 404 errors
- **Solution**: Check PHP file paths and server configuration

---

Need help with any specific part? Let me know!
