<?php
// backend/register.php
require_once 'db.php';
require_once 'utils.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = ($data['role'] === 'employer') ? 'employer' : 'jobseeker';

if (!$name || !$email || !$password) {
    json_response(['error' => 'Missing fields']);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$name, $email, $hash, $role]);
    json_response(['ok' => true, 'message' => 'Registered']);
} catch (PDOException $e) {
    json_response(['error' => 'Email already exists or DB error']);
}
?>