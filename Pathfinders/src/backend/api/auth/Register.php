<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->user_type)) {
    
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $data->email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Email already exists"]);
        exit();
    }
    
    // Insert new user
    $query = "INSERT INTO users (name, email, password, user_type, company) 
              VALUES (:name, :email, :password, :user_type, :company)";
    
    $stmt = $db->prepare($query);
    
    // Hash password
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
    
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":user_type", $data->user_type);
    
    $company = isset($data->company) ? $data->company : null;
    $stmt->bindParam(":company", $company);
    
    if ($stmt->execute()) {
        $user_id = $db->lastInsertId();
        
        // Return user data (without password)
        $user_query = "SELECT id, name, email, user_type, company FROM users WHERE id = :id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(":id", $user_id);
        $user_stmt->execute();
        $user = $user_stmt->fetch();
        
        // Start session
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = $user['user_type'];
        
        http_response_code(201);
        echo json_encode([
            "message" => "User registered successfully",
            "user" => [
                "id" => (string)$user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "type" => $user['user_type'],
                "company" => $user['company']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to register user"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>