<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Only employers can delete lessons
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->lesson_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$lesson_id = $data->lesson_id;
$creator_id = $_SESSION['user_id'];

$check = "SELECT creator_id FROM lessons WHERE id = :id";
$stmt = $db->prepare($check);
$stmt->bindParam(':id', $lesson_id);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Lesson not found"]);
    exit();
}

$row = $stmt->fetch();
if ($row['creator_id'] != $creator_id) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden"]);
    exit();
}

$del = "DELETE FROM lessons WHERE id = :id";
$delStmt = $db->prepare($del);
$delStmt->bindParam(':id', $lesson_id);

if ($delStmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Lesson deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to delete lesson"]);
}

?>
