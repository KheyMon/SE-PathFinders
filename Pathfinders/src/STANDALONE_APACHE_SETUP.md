# PathFinder Backend - Standalone Apache + MySQL Setup

## 🎯 Using Standalone Apache (No XAMPP)

This guide is for running Apache directly from its bin directory using `httpd` command.

---

## 📋 PREREQUISITES

### What You Need:
1. ✅ **Apache HTTP Server** - Download from https://httpd.apache.org/
2. ✅ **MySQL Server** - Download from https://dev.mysql.com/downloads/mysql/
3. ✅ **PHP** - Download from https://www.php.net/downloads.php

### Recommended Versions:
- Apache 2.4.x
- MySQL 8.0.x or 5.7.x
- PHP 8.1.x or 7.4.x

---

## 🔧 STEP 1: INSTALL & CONFIGURE PHP

### 1.1 Download PHP
1. Download PHP (Thread Safe version for Apache)
2. Extract to `C:\php\` (or your preferred location)

### 1.2 Configure php.ini
1. Copy `php.ini-development` to `php.ini`
2. Edit `php.ini` and uncomment these lines:

```ini
extension=mysqli
extension=pdo_mysql
extension=openssl
extension=mbstring
extension=curl

extension_dir = "ext"
```

3. Find and set:
```ini
error_reporting = E_ALL
display_errors = On
```

### 1.3 Add PHP to System PATH
1. Open System Environment Variables
2. Edit PATH variable
3. Add: `C:\php\` (or your PHP location)
4. Test: Open cmd and type `php -v`

---

## 🌐 STEP 2: CONFIGURE APACHE

### 2.1 Locate Apache
Find your Apache installation directory (e.g., `C:\Apache24\`)

### 2.2 Edit httpd.conf
Open `C:\Apache24\conf\httpd.conf` and add at the end:

```apache
# Load PHP Module
LoadModule php_module "C:/php/php8apache2_4.dll"

# Configure PHP
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>

PHPIniDir "C:/php"

# Add index.php to directory index
<IfModule dir_module>
    DirectoryIndex index.html index.php
</IfModule>
```

**Note:** Adjust paths to match your PHP installation. Use forward slashes `/` even on Windows.

### 2.3 Set Document Root
Find this line in `httpd.conf`:

```apache
DocumentRoot "C:/Apache24/htdocs"
```

**Change it to your custom location:**

```apache
DocumentRoot "D:/www"
```

Also find and update the Directory directive:

```apache
<Directory "D:/www">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

This is where your PathFinder backend will go:
```
D:/www/pathfinder/backend/
```

### 2.4 Enable .htaccess (Optional but Recommended)

Already configured in the Directory directive above. Make sure `AllowOverride All` is set.

---

## 🗄️ STEP 3: INSTALL & CONFIGURE MYSQL

### 3.1 Install MySQL
1. Download MySQL Installer
2. Choose "Developer Default" or "Server Only"
3. Set root password (remember this!)
4. Complete installation

### 3.2 Verify MySQL is Running
```cmd
# Check MySQL service
net start | findstr MySQL

# Or start manually
net start MySQL80
```

### 3.3 Access MySQL
```cmd
mysql -u root -p
```

Enter your root password when prompted.

---

## 🚀 STEP 4: START APACHE

### 4.1 Open Command Prompt as Administrator

### 4.2 Navigate to Apache bin Directory
```cmd
cd C:\Apache24\bin
```

### 4.3 Test Apache Configuration
```cmd
httpd -t
```

Should return: `Syntax OK`

### 4.4 Start Apache
```cmd
httpd
```

**Note:** This runs Apache in the foreground. Keep this cmd window open.

**Alternative - Run as Service:**
```cmd
# Install Apache as Windows service
httpd -k install

# Start the service
httpd -k start

# Stop the service
httpd -k stop

# Uninstall service
httpd -k uninstall
```

### 4.5 Verify Apache is Running
Open browser and go to: `http://localhost/`

You should see Apache welcome page or "It works!"

---

## 📁 STEP 5: CREATE PATHFINDER FOLDER STRUCTURE

### 5.1 Create Folders
In your custom document root directory:

```
D:\www\pathfinder\backend\
```

Full structure:
```
D:\www\pathfinder\backend\
├── config\
│   ├── database.php
│   └── cors.php
└── api\
    ├── auth\
    │   ├── login.php
    │   ├── register.php
    │   └── logout.php
    ├── jobs\
    │   ├── list.php
    │   ├── create.php
    │   ├── update.php
    │   ├── delete.php
    │   └── my-jobs.php
    ├── applications\
    │   ├── apply.php
    │   ├── list.php
    │   ├── my-applications.php
    │   └── update-status.php
    ├── lessons\
    │   ├── list.php
    │   ├── create.php
    │   ├── delete.php
    │   └── my-lessons.php
    ├── notifications\
    │   ├── list.php
    │   ├── mark-read.php
    │   └── mark-all-read.php
    └── users\
        ├── profile.php
        └── update.php
```

---

## 💾 STEP 6: CREATE DATABASE

### 6.1 Open MySQL Command Line
```cmd
mysql -u root -p
```

### 6.2 Create Database
```sql
CREATE DATABASE pathfinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6.3 Create Database User (Recommended)
```sql
CREATE USER 'pathfinder_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON pathfinder.* TO 'pathfinder_user'@'localhost';
FLUSH PRIVILEGES;
```

### 6.4 Use Database
```sql
USE pathfinder;
```

### 6.5 Create Tables

Copy and paste this entire SQL script:

```sql
-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('jobseeker', 'employer') NOT NULL,
    company VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Jobs Table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    salary VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT,
    skills JSON,
    status ENUM('active', 'closed') DEFAULT 'active',
    posted_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Applications Table
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    applied_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, applicant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Lessons Table
CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    visibility ENUM('public', 'private') DEFAULT 'public',
    created_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Progress Table (for SkillBuild)
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (user_id, module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 6.6 Verify Tables
```sql
SHOW TABLES;
```

Should show: users, jobs, applications, lessons, notifications, progress

### 6.7 Exit MySQL
```sql
exit;
```

---

## 📝 STEP 7: COPY PHP FILES

### 7.1 Update Database Configuration

Open `/PHP_FILES_COMPLETE.md` and copy all 23 PHP files into your folder structure.

**IMPORTANT:** Update `config/database.php` with your MySQL credentials:

```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "pathfinder";
    private $username = "pathfinder_user";  // or "root"
    private $password = "your_password_here";  // your MySQL password
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

### 7.2 Copy All Files
Follow `/PHP_FILES_COMPLETE.md` and copy all 23 files:
- 2 config files
- 3 auth files
- 5 jobs files
- 4 applications files
- 4 lessons files
- 3 notifications files
- 2 users files

---

## ✅ STEP 8: TEST THE BACKEND

### 8.1 Test PHP Info
Create a test file: `D:\www\test.php`

```php
<?php
phpinfo();
?>
```

Visit: `http://localhost/test.php`

You should see PHP information page.

### 8.2 Test Database Connection
Create: `D:\www\pathfinder\backend\test-db.php`

```php
<?php
require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "✅ Database connection successful!";
} else {
    echo "❌ Database connection failed!";
}
?>
```

Visit: `http://localhost/pathfinder/backend/test-db.php`

Should show: ✅ Database connection successful!

### 8.3 Test Job Listings API
Visit: `http://localhost/pathfinder/backend/api/jobs/list.php`

Should return: `[]` (empty array, since no jobs yet)

### 8.4 Test with Mock Data
Insert test data into MySQL:

```sql
mysql -u root -p

USE pathfinder;

-- Create test employer
INSERT INTO users (name, email, password, user_type, company) 
VALUES ('Test Company', 'employer@test.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'employer', 'Test Corp');

-- Create test job
INSERT INTO jobs (employer_id, title, company, location, job_type, salary, description, requirements, skills, posted_date)
VALUES (1, 'Software Developer', 'Test Corp', 'Cebu City', 'Full-time', '₱30,000 - ₱50,000', 'We are hiring!', 'None', '["JavaScript", "PHP"]', CURDATE());

exit;
```

Visit: `http://localhost/pathfinder/backend/api/jobs/list.php`

Should return JSON with the test job!

---

## 🔧 STEP 9: CONFIGURE SESSIONS

### 9.1 Check PHP Session Settings
In `php.ini`, verify:

```ini
session.save_path = "C:/php/tmp"
```

### 9.2 Create Session Directory
```cmd
mkdir C:\php\tmp
```

---

## 🌐 STEP 10: UPDATE REACT API CONFIGURATION

### 10.1 Update API Base URL
In your React app, open `/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost/pathfinder/backend/api';
```

This should work with standalone Apache!

---

## 🎯 QUICK COMMAND REFERENCE

### Start Apache
```cmd
# Navigate to Apache bin
cd C:\Apache24\bin

# Start Apache (foreground)
httpd

# OR install and start as service
httpd -k install
httpd -k start
```

### Stop Apache
```cmd
# If running in foreground: Press Ctrl+C

# If running as service:
httpd -k stop
```

### Start MySQL
```cmd
net start MySQL80
```

### Stop MySQL
```cmd
net stop MySQL80
```

### Test Apache Config
```cmd
cd C:\Apache24\bin
httpd -t
```

### View Apache Error Log
```
C:\Apache24\logs\error.log
```

---

## 🐛 TROUBLESHOOTING

### Apache Won't Start

**Error: "Port 80 already in use"**
- Check if IIS or Skype is using port 80
- Change Apache port in `httpd.conf`:
  ```apache
  Listen 8080
  ```
- Then access: `http://localhost:8080/`

**Error: "Cannot load php module"**
- Check PHP path in `httpd.conf` is correct
- Ensure you downloaded Thread Safe PHP version
- Check PHP version matches Apache (both 32-bit or both 64-bit)

### PHP Not Working

**PHP code shows as plain text**
- Check PHP module is loaded in `httpd.conf`
- Restart Apache after config changes
- Check `.php` file extension is correct

**PHP extensions not loading**
- Check `extension_dir` in `php.ini`
- Check extensions are uncommented in `php.ini`
- Restart Apache

### Database Connection Failed

**Error: "Connection error"**
- Check MySQL is running: `net start | findstr MySQL`
- Verify credentials in `config/database.php`
- Test MySQL login: `mysql -u root -p`

**Error: "Access denied"**
- Check username and password in `config/database.php`
- Verify user has permissions: `SHOW GRANTS FOR 'pathfinder_user'@'localhost';`

### CORS Errors

**Error: "CORS policy blocked"**
- Ensure `config/cors.php` is included in all API files
- Check `require_once '../../config/cors.php';` is at the top
- Restart Apache after changes

### 404 Not Found

**Error: "Not Found"**
- Check file path is correct
- Check file extension is `.php`
- Verify Apache DocumentRoot is correct
- Check file permissions (should be readable)

---

## 📊 DIRECTORY STRUCTURE REFERENCE

```
Your Standalone Setup with Custom Document Root:

├── C:\Apache24\                    (Apache installation)
│   ├── bin\
│   │   └── httpd.exe              (Apache executable)
│   ├── conf\
│   │   └── httpd.conf             (Apache config - DocumentRoot set to D:/www)
│   └── logs\
│       ├── error.log
│       └── access.log
│
├── D:\www\                         (Your custom document root)
│   ├── test.php                   (PHP test file)
│   └── pathfinder\
│       └── backend\               (Your PHP backend)
│           ├── test-db.php       (Database test file)
│           ├── config\
│           │   ├── database.php
│           │   └── cors.php
│           └── api\
│               ├── auth\
│               ├── jobs\
│               ├── applications\
│               ├── lessons\
│               ├── notifications\
│               └── users\
│
├── C:\php\                         (PHP installation)
│   ├── php.exe
│   ├── php.ini
│   ├── tmp\                       (Session files)
│   └── ext\                       (PHP extensions)
│
└── C:\Program Files\MySQL\         (MySQL installation)
    └── MySQL Server 8.0\
```

---

## ✅ FINAL CHECKLIST

### Apache Setup:
- [ ] Apache installed
- [ ] PHP module configured in httpd.conf
- [ ] Apache starts without errors
- [ ] Can access http://localhost/
- [ ] PHP info page works

### MySQL Setup:
- [ ] MySQL installed and running
- [ ] Database 'pathfinder' created
- [ ] All 6 tables created
- [ ] Test connection works

### Backend Files:
- [ ] All 23 PHP files copied
- [ ] config/database.php updated with credentials
- [ ] Folder structure correct
- [ ] File permissions correct

### Testing:
- [ ] test-db.php shows success
- [ ] jobs/list.php returns JSON
- [ ] No errors in Apache error.log

---

## 🎯 ADVANTAGES OF STANDALONE APACHE

### ✅ Benefits:
- More control over configuration
- Lighter weight (no XAMPP overhead)
- Better for production-like setup
- Learn real Apache configuration
- Can customize everything

### 🎓 Learning:
- Understand how Apache works
- Learn PHP configuration
- Better for portfolio projects
- More "professional" setup

---

## 📚 NEXT STEPS

Once your backend is working:

1. ✅ Test all endpoints in browser
2. ✅ Use Postman/Insomnia to test POST/PUT/DELETE
3. ✅ Read `/REACT_INTEGRATION_EXAMPLES.md`
4. ✅ Connect your React app to backend
5. ✅ Test registration and login
6. ✅ Test job features

---

## 🔗 USEFUL LINKS

- Apache Documentation: https://httpd.apache.org/docs/
- PHP Manual: https://www.php.net/manual/
- MySQL Documentation: https://dev.mysql.com/doc/

---

**Your standalone Apache + MySQL setup is ready!** 🚀

Keep the cmd window with `httpd` running, and your backend will be live at:
`http://localhost/pathfinder/backend/api/`