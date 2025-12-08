<?php
// backend/apply_job.php
require_once 'db.php';
require_once 'utils.php';
session_start();

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'jobseeker') {
    json_response(['error'=>'unauthorized']);
}
$data = json_decode(file_get_contents('php://input'), true);
$job_id = intval($data['job_id'] ?? 0);
$resume = $data['resume'] ?? '';

if (!$job_id) json_response(['error'=>'missing job_id']);

$stmt = $pdo->prepare("INSERT INTO applications (job_id, seeker_id, resume) VALUES (?, ?, ?)");
$stmt->execute([$job_id, $_SESSION['user']['id'], $resume]);
json_response(['ok'=>true, 'application_id'=>$pdo->lastInsertId()]);
?>