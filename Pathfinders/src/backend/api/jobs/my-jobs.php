<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Only employers can view their jobs
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$employer_id = $_SESSION['user_id'];

$query = "SELECT j.* FROM jobs j WHERE j.employer_id = :employer_id ORDER BY j.posted_date DESC";
$stmt = $db->prepare($query);
$stmt->bindParam(':employer_id', $employer_id);
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
        "status" => $row['status']
    ];
    array_push($jobs, $job);
}

http_response_code(200);
echo json_encode($jobs);
?>
