CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('job_seeker', 'employer', 'admin') DEFAULT 'job_seeker',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
