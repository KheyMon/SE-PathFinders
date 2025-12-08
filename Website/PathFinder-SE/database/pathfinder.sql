-- pathfinder.sql
CREATE DATABASE IF NOT EXISTS pathfinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pathfinder;

-- users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('jobseeker','employer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- jobs
CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(150),
  category VARCHAR(100),
  salary DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- applications
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  seeker_id INT NOT NULL,
  resume TEXT,
  status ENUM('Pending','Accepted','Rejected') DEFAULT 'Pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE
);

-- seed users
INSERT INTO users (name, email, password, role)
VALUES
('Demo Employer','techcorp@gmail.com', 'password', 'employer'),
('Demo Seeker','johndoe@gmail.com', 'password', 'jobseeker');

-- seed job
INSERT INTO jobs (employer_id, title, description, location, category, salary)
VALUES (1, 'Frontend Developer', 'Build responsive web pages', 'Remote', 'Software', 25000);
