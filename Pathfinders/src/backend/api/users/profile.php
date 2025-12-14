<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getConnection();

// If ?user_id provided, return public profile, else return current user's profile
$queryUserId = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if ($queryUserId) {
    // public profile
    $q = "SELECT id, name, email, user_type, company, phone, location, website, description, created_at FROM users WHERE id = :id";
    $stmt = $db->prepare($q);
    $stmt->bindParam(':id', $queryUserId);
    $stmt->execute();
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["message" => "User not found"]);
        exit();
    }
    $user = $stmt->fetch();
    // hide nothing here — caller decides which fields to show; keep safe
    http_response_code(200);
    echo json_encode(["user" => $user]);
    exit();
}

// current user profile (requires session)
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$q = "SELECT id, name, email, user_type, company, phone, location, website, description, created_at FROM users WHERE id = :id";
$stmt = $db->prepare($q);
$stmt->bindParam(':id', $user_id);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "User not found"]);
    exit();
}

$user = $stmt->fetch();
http_response_code(200);
echo json_encode(["user" => $user]);

?>
