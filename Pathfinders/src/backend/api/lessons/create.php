<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Only employers can create lessons
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->title) || empty($data->content)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$creator_id = $_SESSION['user_id'];
$title = $data->title;
$description = isset($data->description) ? $data->description : null;
$content = $data->content;
$visibility = isset($data->visibility) ? $data->visibility : 'public';
$created_date = date('Y-m-d');

$query = "INSERT INTO lessons (creator_id, title, description, content, visibility, created_date) VALUES (:creator_id, :title, :description, :content, :visibility, :created_date)";
$stmt = $db->prepare($query);
$stmt->bindParam(':creator_id', $creator_id);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':content', $content);
$stmt->bindParam(':visibility', $visibility);
$stmt->bindParam(':created_date', $created_date);

if ($stmt->execute()) {
    $lesson_id = $db->lastInsertId();
    http_response_code(201);
    echo json_encode(["message" => "Lesson created successfully", "lesson_id" => (string)$lesson_id]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to create lesson"]);
}

?>
