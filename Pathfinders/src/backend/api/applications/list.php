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

$job_id = isset($_GET['job_id']) ? $_GET['job_id'] : null;
$user_id = $_SESSION['user_id'];
$user_type = $_SESSION['user_type'];

if (!$job_id) {
    http_response_code(400);
    echo json_encode(["message" => "job_id is required"]);
    exit();
}

// Verify job exists and owner
$jobQ = "SELECT employer_id FROM jobs WHERE id = :id";
$jobStmt = $db->prepare($jobQ);
$jobStmt->bindParam(':id', $job_id);
$jobStmt->execute();
if ($jobStmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Job not found"]);
    exit();
}
$job = $jobStmt->fetch();

if ($user_type !== 'employer' || $job['employer_id'] != $user_id) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden"]);
    exit();
}

$query = "SELECT a.*, u.name as applicant_name, u.email as applicant_email
          FROM applications a
          LEFT JOIN users u ON a.applicant_id = u.id
          WHERE a.job_id = :job_id
          ORDER BY a.applied_date DESC";
$stmt = $db->prepare($query);
$stmt->bindParam(':job_id', $job_id);
$stmt->execute();

$applications = [];
while ($row = $stmt->fetch()) {
    $app = [
        "id" => (string)$row['id'],
        "jobId" => (string)$row['job_id'],
        "applicantId" => (string)$row['applicant_id'],
        "applicantName" => $row['applicant_name'],
        "applicantEmail" => $row['applicant_email'],
        "appliedDate" => $row['applied_date'],
        "status" => $row['status']
    ];
    array_push($applications, $app);
}

http_response_code(200);
echo json_encode($applications);
?>
