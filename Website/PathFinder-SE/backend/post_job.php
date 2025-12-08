<?php
// backend/post_job.php
require_once 'db.php';
require_once 'utils.php';
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'employer') {
    json_response(['error'=>'unauthorized']);
}
$data = json_decode(file_get_contents('php://input'), true);
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$location = $data['location'] ?? '';
$category = $data['category'] ?? '';
$salary = floatval($data['salary'] ?? 0);

if (!$title) json_response(['error'=>'missing title']);

$stmt = $pdo->prepare("INSERT INTO jobs (employer_id, title, description, location, category, salary) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->execute([$_SESSION['user']['id'], $title, $description, $location, $category, $salary]);
json_response(['ok'=>true, 'job_id' => $pdo->lastInsertId()]);
?>