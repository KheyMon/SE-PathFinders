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

$q = "SELECT id, type, title, message, is_read, created_at FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC";
$stmt = $db->prepare($q);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();

$notifs = [];
while ($row = $stmt->fetch()) {
    $notifs[] = [
        'id' => (string)$row['id'],
        'type' => $row['type'],
        'title' => $row['title'],
        'message' => $row['message'],
        'isRead' => (bool)$row['is_read'],
        'createdAt' => $row['created_at']
    ];
}

http_response_code(200);
echo json_encode($notifs);

?>
