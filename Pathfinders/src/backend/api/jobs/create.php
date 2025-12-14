<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Check authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'employer') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && !empty($data->description)) {
    
    $query = "INSERT INTO jobs 
              (employer_id, title, company, location, job_type, salary, description, requirements, skills, posted_date) 
              VALUES 
              (:employer_id, :title, :company, :location, :job_type, :salary, :description, :requirements, :skills, :posted_date)";
    
    $stmt = $db->prepare($query);
    
    $employer_id = $_SESSION['user_id'];
    $skills_json = json_encode($data->skills);
    $posted_date = date('Y-m-d');
    
    $stmt->bindParam(":employer_id", $employer_id);
    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":company", $data->company);
    $stmt->bindParam(":location", $data->location);
    $stmt->bindParam(":job_type", $data->type);
    $stmt->bindParam(":salary", $data->salary);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":requirements", $data->requirements);
    $stmt->bindParam(":skills", $skills_json);
    $stmt->bindParam(":posted_date", $posted_date);
    
    if ($stmt->execute()) {
        $job_id = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "message" => "Job created successfully",
            "job_id" => (string)$job_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to create job"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>