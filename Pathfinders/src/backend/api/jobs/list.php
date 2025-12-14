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