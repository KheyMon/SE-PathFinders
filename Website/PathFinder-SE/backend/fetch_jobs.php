<?php
// backend/fetch_jobs.php
require_once 'db.php';

$stmt = $pdo->query("SELECT jobs.*, users.name AS employer_name FROM jobs JOIN users ON users.id = jobs.employer_id ORDER BY jobs.created_at DESC");
$jobs = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode($jobs);
?>