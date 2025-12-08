<?php
// backend/fetch_job.php
require_once 'db.php';
$id = intval($_GET['id'] ?? 0);
if (!$id) { echo json_encode(['error'=>'missing id']); exit; }
$stmt = $pdo->prepare("SELECT jobs.*, users.name AS employer_name FROM jobs JOIN users ON users.id = jobs.employer_id WHERE jobs.id = ?");
$stmt->execute([$id]);
$job = $stmt->fetch();
echo json_encode($job);
?>