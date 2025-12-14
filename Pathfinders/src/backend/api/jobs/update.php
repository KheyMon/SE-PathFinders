<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Only employers can update jobs
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->job_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
    exit();
}

$job_id = $data->job_id;
$employer_id = $_SESSION['user_id'];

// Verify ownership
$check = "SELECT employer_id FROM jobs WHERE id = :id";
$checkStmt = $db->prepare($check);
$checkStmt->bindParam(':id', $job_id);
$checkStmt->execute();
if ($checkStmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Job not found"]);
    exit();
}
$row = $checkStmt->fetch();
if ($row['employer_id'] != $employer_id) {
    http_response_code(403);
    echo json_encode(["message" => "Forbidden"]);
    exit();
}

// Build update fields
$fields = [];
$params = [':id' => $job_id];
$allowed = ['title'=>'title','company'=>'company','location'=>'location','type'=>'job_type','salary'=>'salary','description'=>'description','requirements'=>'requirements','skills'=>'skills','status'=>'status'];
foreach ($allowed as $inputKey => $dbKey) {
    if (isset($data->{$inputKey})) {
        if ($inputKey === 'skills') {
            $fields[] = "$dbKey = :$inputKey";
            $params[":$inputKey"] = json_encode($data->{$inputKey});
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

$sql = "UPDATE jobs SET " . implode(', ', $fields) . " WHERE id = :id";
$stmt = $db->prepare($sql);
foreach ($params as $k=>$v) $stmt->bindValue($k, $v);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(["message" => "Job updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Unable to update job"]);
}

?>
