<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Check authentication
if (!isset($_SESSION['user_id']) || $_SESSION['user_type'] !== 'jobseeker') {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->job_id)) {
    
    // Check if already applied
    $check_query = "SELECT id FROM applications WHERE job_id = :job_id AND applicant_id = :applicant_id";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":job_id", $data->job_id);
    $check_stmt->bindParam(":applicant_id", $_SESSION['user_id']);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Already applied to this job"]);
        exit();
    }
    
    $query = "INSERT INTO applications (job_id, applicant_id, applied_date) 
              VALUES (:job_id, :applicant_id, :applied_date)";
    
    $stmt = $db->prepare($query);
    
    $applied_date = date('Y-m-d');
    
    $stmt->bindParam(":job_id", $data->job_id);
    $stmt->bindParam(":applicant_id", $_SESSION['user_id']);
    $stmt->bindParam(":applied_date", $applied_date);
    
    if ($stmt->execute()) {
        $application_id = $db->lastInsertId();
        
        // Create notification for employer
        $job_query = "SELECT employer_id, title, company FROM jobs WHERE id = :job_id";
        $job_stmt = $db->prepare($job_query);
        $job_stmt->bindParam(":job_id", $data->job_id);
        $job_stmt->execute();
        $job = $job_stmt->fetch();
        
        $user_query = "SELECT name FROM users WHERE id = :user_id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(":user_id", $_SESSION['user_id']);
        $user_stmt->execute();
        $user = $user_stmt->fetch();
        
        $notif_query = "INSERT INTO notifications (user_id, type, title, message) 
                        VALUES (:user_id, 'application', :title, :message)";
        $notif_stmt = $db->prepare($notif_query);
        $notif_title = "New Application";
        $notif_message = $user['name'] . " applied for " . $job['title'];
        $notif_stmt->bindParam(":user_id", $job['employer_id']);
        $notif_stmt->bindParam(":title", $notif_title);
        $notif_stmt->bindParam(":message", $notif_message);
        $notif_stmt->execute();
        
        http_response_code(201);
        echo json_encode([
            "message" => "Application submitted successfully",
            "application_id" => (string)$application_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to submit application"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>