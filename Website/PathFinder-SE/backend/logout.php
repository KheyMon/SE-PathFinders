<?php
// backend/logout.php
require_once 'utils.php';
session_destroy();
json_response(['ok'=>true]);
?>