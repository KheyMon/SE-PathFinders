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
$user_type = $_SESSION['user_type'];

$lessons = [];
if ($user_type === 'employer') {
    $q = "SELECT * FROM lessons WHERE creator_id = :creator_id ORDER BY created_date DESC";
    $stmt = $db->prepare($q);
    $stmt->bindParam(':creator_id', $user_id);
    $stmt->execute();
    while ($row = $stmt->fetch()) {
        $lessons[] = [
            'id' => (string)$row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'visibility' => $row['visibility'],
            'createdDate' => $row['created_date']
        ];
    }
} else {
    // Jobseeker: fetch assigned lessons
    $q = "SELECT l.* FROM lesson_assignments la JOIN lessons l ON la.lesson_id = l.id WHERE la.user_id = :user_id ORDER BY la.assigned_date DESC";
    $stmt = $db->prepare($q);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    while ($row = $stmt->fetch()) {
        $lessons[] = [
            'id' => (string)$row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'visibility' => $row['visibility'],
            'createdDate' => $row['created_date']
        ];
    }
}

http_response_code(200);
echo json_encode($lessons);

?>
