# PathFinder - Complete PHP Backend Files
## Ready to Copy & Paste

---

## 📁 File Structure

Create this folder structure in `C:\xampp\htdocs\pathfinder\backend\`:

```
backend/
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
    │   ├── update.php
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

---

## 🔧 CONFIG FILES

### `config/database.php`

```php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "pathfinder";
    private $username = "root";
    private $password = "";
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

---

### `config/cors.php`

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

---

## 🔐 AUTHENTICATION FILES

### `api/auth/register.php`

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
    
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    $company = isset($data->company) ? $data->company : null;
    
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":user_type", $data->user_type);
    $stmt->bindParam(":company", $company);
    
    if ($stmt->execute()) {
        $user_id = $db->lastInsertId();
        
        $user_query = "SELECT id, name, email, user_type, company FROM users WHERE id = :id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(":id", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->fetch();
        
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

---

### `api/auth/login.php`

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

---

### `api/auth/logout.php`

```php
<?php
require_once '../../config/cors.php';

session_start();
session_destroy();

http_response_code(200);
echo json_encode(["message" => "Logged out successfully"]);
?>
```

---

## 💼 JOBS FILES

### `api/jobs/list.php`

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

---

### `api/jobs/create.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

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

---

### `api/jobs/my-jobs.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM jobs WHERE employer_id = :employer_id ORDER BY posted_date DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":employer_id", $_SESSION['user_id']);
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
        "status" => $row['status'],
        "postedBy" => (string)$row['employer_id']
    ];
    array_push($jobs, $job);
}

http_response_code(200);
echo json_encode($jobs);
?>
```

---

### `api/jobs/update.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->job_id)) {
    
    $query = "UPDATE jobs SET 
              title = :title,
              company = :company,
              location = :location,
              job_type = :job_type,
              salary = :salary,
              description = :description,
              requirements = :requirements,
              skills = :skills,
              status = :status
              WHERE id = :job_id AND employer_id = :employer_id";
    
    $stmt = $db->prepare($query);
    
    $skills_json = json_encode($data->skills);
    
    $stmt->bindParam(":job_id", $data->job_id);
    $stmt->bindParam(":employer_id", $_SESSION['user_id']);
    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":company", $data->company);
    $stmt->bindParam(":location", $data->location);
    $stmt->bindParam(":job_type", $data->type);
    $stmt->bindParam(":salary", $data->salary);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":requirements", $data->requirements);
    $stmt->bindParam(":skills", $skills_json);
    $stmt->bindParam(":status", $data->status);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Job updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to update job"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

---

### `api/jobs/delete.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->job_id)) {
    
    $query = "DELETE FROM jobs WHERE id = :job_id AND employer_id = :employer_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":job_id", $data->job_id);
    $stmt->bindParam(":employer_id", $_SESSION['user_id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Job deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to delete job"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

---

## 📝 APPLICATIONS FILES

### `api/applications/apply.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

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
        $job_query = "SELECT employer_id, title FROM jobs WHERE id = :job_id";
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

---

### `api/applications/my-applications.php`

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
        "jobTitle" => $row['title'],
        "company" => $row['company'],
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

### `api/applications/list.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Get applications for jobs posted by this employer
$query = "SELECT a.*, j.title, j.company, u.name as applicant_name, u.email as applicant_email
          FROM applications a
          LEFT JOIN jobs j ON a.job_id = j.id
          LEFT JOIN users u ON a.applicant_id = u.id
          WHERE j.employer_id = :employer_id
          ORDER BY a.applied_date DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":employer_id", $_SESSION['user_id']);
$stmt->execute();

$applications = [];
while ($row = $stmt->fetch()) {
    $application = [
        "id" => (string)$row['id'],
        "jobId" => (string)$row['job_id'],
        "jobTitle" => $row['title'],
        "company" => $row['company'],
        "applicantId" => (string)$row['applicant_id'],
        "applicantName" => $row['applicant_name'],
        "applicantEmail" => $row['applicant_email'],
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

### `api/applications/update-status.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->application_id) && !empty($data->status)) {
    
    $query = "UPDATE applications a
              INNER JOIN jobs j ON a.job_id = j.id
              SET a.status = :status
              WHERE a.id = :application_id AND j.employer_id = :employer_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":application_id", $data->application_id);
    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":employer_id", $_SESSION['user_id']);
    
    if ($stmt->execute()) {
        
        // Create notification for applicant
        $app_query = "SELECT applicant_id, job_id FROM applications WHERE id = :application_id";
        $app_stmt = $db->prepare($app_query);
        $app_stmt->bindParam(":application_id", $data->application_id);
        $app_stmt->execute();
        $app = $app_stmt->fetch();
        
        $job_query = "SELECT title FROM jobs WHERE id = :job_id";
        $job_stmt = $db->prepare($job_query);
        $job_stmt->bindParam(":job_id", $app['job_id']);
        $job_stmt->execute();
        $job = $job_stmt->fetch();
        
        $notif_query = "INSERT INTO notifications (user_id, type, title, message) 
                        VALUES (:user_id, 'application-status', :title, :message)";
        $notif_stmt = $db->prepare($notif_query);
        $notif_title = "Application " . $data->status;
        $notif_message = "Your application for " . $job['title'] . " has been " . strtolower($data->status);
        $notif_stmt->bindParam(":user_id", $app['applicant_id']);
        $notif_stmt->bindParam(":title", $notif_title);
        $notif_stmt->bindParam(":message", $notif_message);
        $notif_stmt->execute();
        
        http_response_code(200);
        echo json_encode(["message" => "Application status updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to update application status"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

---

## 📚 LESSONS FILES

### `api/lessons/list.php`

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

// Get all public lessons or lessons assigned to user
$query = "SELECT l.*, u.name as creator_name 
          FROM lessons l
          LEFT JOIN users u ON l.creator_id = u.id
          WHERE l.visibility = 'public'
          ORDER BY l.created_date DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$lessons = [];
while ($row = $stmt->fetch()) {
    $lesson = [
        "id" => (string)$row['id'],
        "title" => $row['title'],
        "description" => $row['description'],
        "content" => $row['content'],
        "visibility" => $row['visibility'],
        "createdBy" => (string)$row['creator_id'],
        "creatorName" => $row['creator_name'],
        "createdDate" => $row['created_date']
    ];
    array_push($lessons, $lesson);
}

http_response_code(200);
echo json_encode($lessons);
?>
```

---

### `api/lessons/create.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && !empty($data->content)) {
    
    $query = "INSERT INTO lessons 
              (creator_id, title, description, content, visibility, created_date) 
              VALUES 
              (:creator_id, :title, :description, :content, :visibility, :created_date)";
    
    $stmt = $db->prepare($query);
    
    $creator_id = $_SESSION['user_id'];
    $created_date = date('Y-m-d');
    $visibility = isset($data->visibility) ? $data->visibility : 'public';
    
    $stmt->bindParam(":creator_id", $creator_id);
    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":content", $data->content);
    $stmt->bindParam(":visibility", $visibility);
    $stmt->bindParam(":created_date", $created_date);
    
    if ($stmt->execute()) {
        $lesson_id = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "message" => "Lesson created successfully",
            "lesson_id" => (string)$lesson_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to create lesson"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

---

### `api/lessons/my-lessons.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM lessons WHERE creator_id = :creator_id ORDER BY created_date DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":creator_id", $_SESSION['user_id']);
$stmt->execute();

$lessons = [];
while ($row = $stmt->fetch()) {
    $lesson = [
        "id" => (string)$row['id'],
        "title" => $row['title'],
        "description" => $row['description'],
        "content" => $row['content'],
        "visibility" => $row['visibility'],
        "createdBy" => (string)$row['creator_id'],
        "createdDate" => $row['created_date']
    ];
    array_push($lessons, $lesson);
}

http_response_code(200);
echo json_encode($lessons);
?>
```

---

### `api/lessons/delete.php`

```php
<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->lesson_id)) {
    
    $query = "DELETE FROM lessons WHERE id = :lesson_id AND creator_id = :creator_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":lesson_id", $data->lesson_id);
    $stmt->bindParam(":creator_id", $_SESSION['user_id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Lesson deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to delete lesson"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

---

## 🔔 NOTIFICATIONS FILES

### `api/notifications/list.php`

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

$query = "SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $_SESSION['user_id']);
$stmt->execute();

$notifications = [];
while ($row = $stmt->fetch()) {
    $notification = [
        "id" => (string)$row['id'],
        "userId" => (string)$row['user_id'],
        "type" => $row['type'],
        "title" => $row['title'],
        "message" => $row['message'],
        "read" => (bool)$row['is_read'],
        "timestamp" => $row['created_at']
    ];
    array_push($notifications, $notification);
}

http_response_code(200);
echo json_encode($notifications);
?>
```

---

### `api/notifications/mark-read.php`

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
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->notification_id)) {
    
    $query = "UPDATE notifications 
              SET is_read = 1 
              WHERE id = :notification_id AND user_id = :user_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":notification_id", $data->notification_id);
    $stmt->bindParam(":user_id", $_SESSION['user_id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Notification marked as read"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to mark notification as read"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
```

---

### `api/notifications/mark-all-read.php`

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

$query = "UPDATE notifications SET is_read = 1 WHERE user_id = :user_id";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $_SESSION['user_id']);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "All notifications marked as read"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to mark notifications as read"]);
}
?>
```

---

## 👤 USER FILES

### `api/users/profile.php`

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

$query = "SELECT id, name, email, user_type, company, phone, location, website, description 
          FROM users 
          WHERE id = :user_id";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $_SESSION['user_id']);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $user = $stmt->fetch();
    
    http_response_code(200);
    echo json_encode([
        "id" => (string)$user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "type" => $user['user_type'],
        "company" => $user['company'],
        "phone" => $user['phone'],
        "location" => $user['location'],
        "website" => $user['website'],
        "description" => $user['description']
    ]);
} else {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
}
?>
```

---

### `api/users/update.php`

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
$data = json_decode(file_get_contents("php://input"));

$query = "UPDATE users SET 
          name = :name,
          phone = :phone,
          location = :location,
          website = :website,
          description = :description,
          company = :company
          WHERE id = :user_id";

$stmt = $db->prepare($query);

$stmt->bindParam(":user_id", $_SESSION['user_id']);
$stmt->bindParam(":name", $data->name);
$stmt->bindParam(":phone", $data->phone);
$stmt->bindParam(":location", $data->location);
$stmt->bindParam(":website", $data->website);
$stmt->bindParam(":description", $data->description);
$stmt->bindParam(":company", $data->company);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Profile updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to update profile"]);
}
?>
```

---

## ✅ Setup Checklist

1. [ ] Create database `pathfinder` in phpMyAdmin
2. [ ] Run SQL schema to create tables
3. [ ] Create folder: `C:\xampp\htdocs\pathfinder\backend\`
4. [ ] Create all subfolders (config, api, auth, jobs, etc.)
5. [ ] Copy all PHP files above into their respective locations
6. [ ] Test: Open `http://localhost/pathfinder/backend/api/jobs/list.php` in browser
7. [ ] Should see `[]` (empty array) - means it's working!
8. [ ] Update API URL in `/services/api.js` if needed
9. [ ] Test registration in your React app
10. [ ] Test login in your React app

---

## 🎯 Important Notes

- **No UI changes**: These PHP files only handle backend logic
- **Sessions**: Used for authentication (not JWT)
- **CORS**: Configured to allow requests from your React app
- **Security**: Password hashing, SQL injection prevention included
- **Notifications**: Automatically created when actions happen
- **Status codes**: Proper HTTP status codes for all responses

---

## 🆘 If Something Doesn't Work

1. Check XAMPP: Make sure Apache and MySQL are running
2. Check database: Verify database name is `pathfinder`
3. Check paths: Files should be in `C:\xampp\htdocs\pathfinder\backend\`
4. Check errors: Look at browser console and Network tab
5. Check PHP errors: Look in `C:\xampp\apache\logs\error.log`

---

Ready to go! Just copy-paste each file and you're set! 🚀
