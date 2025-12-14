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