<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Only employers should update application status
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->application_id) || empty($data->status)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$application_id = $data->application_id;
$newStatus = $data->status;
$employer_id = $_SESSION['user_id'];

// Verify application exists and belongs to a job owned by this employer
$q = "SELECT a.job_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = :id";
$stmt = $db->prepare($q);
$stmt->bindParam(':id', $application_id);
$stmt->execute();
if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Application not found"]);
    exit();
}
$row = $stmt->fetch();
$job_id = $row['job_id'];

$jobCheck = "SELECT employer_id FROM jobs WHERE id = :id";
$jobStmt = $db->prepare($jobCheck);
$jobStmt->bindParam(':id', $job_id);
$jobStmt->execute();
$job = $jobStmt->fetch();
if ($job['employer_id'] != $employer_id) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden"]);
    exit();
}

$update = "UPDATE applications SET status = :status WHERE id = :id";
$upStmt = $db->prepare($update);
$upStmt->bindParam(':status', $newStatus);
$upStmt->bindParam(':id', $application_id);

if ($upStmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Application status updated"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to update status"]);
}

?>
