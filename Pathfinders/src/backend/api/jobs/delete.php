<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Only employers may delete jobs
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->job_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$job_id = $data->job_id;
$employer_id = $_SESSION['user_id'];

// Verify job belongs to employer
$check = "SELECT employer_id FROM jobs WHERE id = :id";
$stmt = $db->prepare($check);
$stmt->bindParam(':id', $job_id);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Job not found"]);
    exit();
}

$row = $stmt->fetch();
if ($row['employer_id'] != $employer_id) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden"]);
    exit();
}

$del = "DELETE FROM jobs WHERE id = :id";
$delStmt = $db->prepare($del);
$delStmt->bindParam(':id', $job_id);

if ($delStmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Job deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to delete job"]);
}

?>
