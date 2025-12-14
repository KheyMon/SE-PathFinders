const API_BASE_URL = 'http://localhost/pathfinder/backend/api';

class ApiService {
  
  // Auth
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  // Jobs
  async getAllJobs() {
    const response = await fetch(`${API_BASE_URL}/jobs/list.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async createJob(jobData) {
    const response = await fetch(`${API_BASE_URL}/jobs/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(jobData)
    });
    return response.json();
  }

  async getMyJobs() {
    const response = await fetch(`${API_BASE_URL}/jobs/my-jobs.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async deleteJob(jobId) {
    const response = await fetch(`${API_BASE_URL}/jobs/delete.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ job_id: jobId })
    });
    return response.json();
  }

  async updateJob(jobId, updateData) {
    const payload = { job_id: jobId, ...updateData };
    const response = await fetch(`${API_BASE_URL}/jobs/update.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return response.json();
  }

  // Applications
  async applyForJob(jobId) {
    const response = await fetch(`${API_BASE_URL}/applications/apply.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ job_id: jobId })
    });
    return response.json();
  }

  async getMyApplications() {
    const response = await fetch(`${API_BASE_URL}/applications/my-applications.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async getJobApplications(jobId) {
    const response = await fetch(`${API_BASE_URL}/applications/list.php?job_id=${jobId}`, {
      credentials: 'include'
    });
    return response.json();
  }

  async updateApplicationStatus(applicationId, status) {
    const response = await fetch(`${API_BASE_URL}/applications/update-status.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ application_id: applicationId, status })
    });
    return response.json();
  }

  // Lessons
  async getAllLessons() {
    const response = await fetch(`${API_BASE_URL}/lessons/list.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async createLesson(lessonData) {
    const response = await fetch(`${API_BASE_URL}/lessons/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(lessonData)
    });
    return response.json();
  }

  async getMyLessons() {
    const response = await fetch(`${API_BASE_URL}/lessons/my-lessons.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async deleteLesson(lessonId) {
    const response = await fetch(`${API_BASE_URL}/lessons/delete.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ lesson_id: lessonId })
    });
    return response.json();
  }

  async updateLesson(lessonId, updateData) {
    const payload = { lesson_id: lessonId, ...updateData };
    const response = await fetch(`${API_BASE_URL}/lessons/update.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return response.json();
  }

  // Notifications
  async getNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications/list.php`, {
      credentials: 'include'
    });
    return response.json();
  }

  async markNotificationAsRead(notificationId) {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-read.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ notification_id: notificationId })
    });
    return response.json();
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read.php`, {
      method: 'PUT',
      credentials: 'include'
    });
    return response.json();
  }

  // Profile
  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/users/update.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  async getProfile(userId) {
    const url = userId ? `${API_BASE_URL}/users/profile.php?user_id=${userId}` : `${API_BASE_URL}/users/profile.php`;
    const response = await fetch(url, { credentials: 'include' });
    return response.json();
  }
}

export default new ApiService();