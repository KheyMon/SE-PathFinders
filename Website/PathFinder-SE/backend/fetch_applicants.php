<?php
// backend/fetch_applicants.php
require_once 'db.php';
require_once 'utils.php';
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'employer') {
    json_response(['error'=>'unauthorized']);
}
$job_id = intval($_GET['job_id'] ?? 0);
if (!$job_id) json_response(['error'=>'missing job_id']);

// verify employer owns job
$stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = ? AND employer_id = ?");
$stmt->execute([$job_id, $_SESSION['user']['id']]);
if (!$stmt->fetch()) json_response(['error'=>'not allowed']);

$q = $pdo->prepare("SELECT applications.*, users.name AS seeker_name, users.email AS seeker_email FROM applications JOIN users ON users.id = applications.seeker_id WHERE job_id = ?");
$q->execute([$job_id]);
$applicants = $q->fetchAll();
json_response(['ok'=>true, 'applicants'=>$applicants]);
?>