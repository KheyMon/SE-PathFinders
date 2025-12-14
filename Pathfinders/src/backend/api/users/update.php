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
$data = json_decode(file_get_contents("php://input"));

$user_id = $_SESSION['user_id'];

// Build allowed updates
$allowed = ['name'=>'name','company'=>'company','phone'=>'phone','location'=>'location','website'=>'website','description'=>'description','password'=>'password'];
$fields = [];
$params = [':id' => $user_id];
foreach ($allowed as $inputKey => $dbKey) {
    if (isset($data->{$inputKey})) {
        if ($inputKey === 'password') {
            $fields[] = "$dbKey = :$inputKey";
            $params[":$inputKey"] = password_hash($data->{$inputKey}, PASSWORD_DEFAULT);
        } else {
            $fields[] = "$dbKey = :$inputKey";
            $params[":$inputKey"] = $data->{$inputKey};
        }
    }
}

if (count($fields) === 0) {
    http_response_code(400);
    echo json_encode(["message" => "No fields to update"]);
    exit();
}

$sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
$stmt = $db->prepare($sql);
foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v);
}

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Profile updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to update profile"]);
}

?>
