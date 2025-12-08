<?php
// backend/utils.php
session_start();

function json_response($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function require_login() {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        json_response(['error' => 'Unauthorized']);
    }
}
?>