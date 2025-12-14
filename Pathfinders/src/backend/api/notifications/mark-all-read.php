<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user_id = $_SESSION['user_id'];

$update = "UPDATE notifications SET is_read = 1 WHERE user_id = :user_id";
$stmt = $db->prepare($update);
$stmt->bindParam(':user_id', $user_id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "All notifications marked as read"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to update notifications"]);
}

?>
