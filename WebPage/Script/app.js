// App State
const state = {
    currentPage: 'landing',
    user: null,
    applications: [],
    jobs: [
        {
            id: '1',
            title: 'Front Desk Officer',
            company: 'TechCorp Solutions',
            location: 'Manila, Philippines',
            salary: '₱20,000 - ₱25,000',
            type: 'Full-time',
            description: 'We are looking for a professional Front Desk Officer to manage our reception area and provide excellent customer service.',
            requirements: 'High school diploma, excellent communication skills, proficiency in MS Office',
            skills: ['Communication', 'Customer Service', 'IT Literacy'],
            postedBy: 'employer1',
            postedDate: '2025-11-20',
            status: 'open'
        },
        {
            id: '2',
            title: 'Customer Service Representative',
            company: 'Global Connect BPO',
            location: 'Quezon City, Philippines',
            salary: '₱18,000 - ₱22,000',
            type: 'Full-time',
            description: 'Join our dynamic team as a Customer Service Representative. Handle customer inquiries and provide solutions.',
            requirements: 'College level, good English communication, willing to work on shifts',
            skills: ['Communication', 'Basic English', 'Customer Service'],
            postedBy: 'employer2',
            postedDate: '2025-11-18',
            status: 'open'
        },
        {
            id: '3',
            title: 'Data Entry Specialist',
            company: 'DataPro Inc.',
            location: 'Makati, Philippines',
            salary: '₱15,000 - ₱18,000',
            type: 'Part-time',
            description: 'Looking for detail-oriented individuals to handle data entry tasks and maintain accurate records.',
            requirements: 'Basic computer skills, attention to detail, typing speed of 40 WPM',
            skills: ['IT Literacy', 'Workplace Etiquette'],
            postedBy: 'employer1',
            postedDate: '2025-11-22',
            status: 'open'
        },
        {
            id: '4',
            title: 'Sales Associate',
            company: 'RetailMax Philippines',
            location: 'Pasig, Philippines',
            salary: '₱16,000 - ₱20,000 + Commission',
            type: 'Full-time',
            description: 'Seeking energetic Sales Associates to provide excellent customer experience and drive sales.',
            requirements: 'High school graduate, sales experience preferred, good interpersonal skills',
            skills: ['Communication', 'Customer Service', 'Workplace Etiquette'],
            postedBy: 'employer2',
            postedDate: '2025-11-19',
            status: 'open'
        },
        {
            id: '5',
            title: 'Administrative Assistant',
            company: 'Pinnacle Enterprises',
            location: 'Taguig, Philippines',
            salary: '₱22,000 - ₱28,000',
            type: 'Full-time',
            description: 'We need an organized Administrative Assistant to support our operations team.',
            requirements: 'Bachelor\'s degree preferred, proficient in MS Office, excellent organizational skills',
            skills: ['IT Literacy', 'Communication', 'Workplace Etiquette'],
            postedBy: 'employer1',
            postedDate: '2025-11-21',
            status: 'open'
        },
        {
            id: '6',
            title: 'Technical Support Specialist',
            company: 'TechHelp Services',
            location: 'Remote',
            salary: '₱25,000 - ₱30,000',
            type: 'Full-time',
            description: 'Provide technical support to customers via phone and email. Troubleshoot hardware and software issues.',
            requirements: 'College graduate, IT knowledge, problem-solving skills',
            skills: ['IT Literacy', 'Communication', 'Customer Service'],
            postedBy: 'employer2',
            postedDate: '2025-11-23',
            status: 'open'
        }
    ],
    selectedJob: null,
    hasResume: false,
    selectedSkill: null,
    currentModule: null
};

// Navigation
function navigateTo(page) {
    state.currentPage = page;
    updateHeader();
    renderPage();
}

function updateHeader() {
    const header = document.getElementById('header');
    const authButton = document.getElementById('auth-button');
    
    if (state.currentPage === 'login' || state.currentPage === 'register') {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    if (state.user) {
        authButton.textContent = 'Logout';
    } else {
        authButton.textContent = 'Login';
    }
}

function handleAuthClick() {
    if (state.user) {
        state.user = null;
        navigateTo('landing');
    } else {
        navigateTo('login');
    }
}

// Page Rendering
function renderPage() {
    const mainContent = document.getElementById('main-content');
    
    switch(state.currentPage) {
        case 'landing':
            mainContent.innerHTML = renderLandingPage();
            break;
        case 'login':
            mainContent.innerHTML = renderLoginPage();
            break;
        case 'register':
            mainContent.innerHTML = renderRegisterPage();
            break;
        case 'job-listings':
            mainContent.innerHTML = renderJobListings();
            break;
        case 'jobseeker-dashboard':
            mainContent.innerHTML = renderJobSeekerDashboard();
            break;
        case 'employer-dashboard':
            mainContent.innerHTML = renderEmployerDashboard();
            break;
        case 'skillbuild':
            mainContent.innerHTML = renderSkillBuildHome();
            break;
        case 'skill-module':
            mainContent.innerHTML = renderSkillModule();
            break;
        case 'assessment':
            mainContent.innerHTML = renderAssessment();
            break;
        case 'application-status':
            mainContent.innerHTML = renderApplicationStatus();
            break;
        case 'post-job':
            mainContent.innerHTML = renderPostJob();
            break;
        case 'manage-jobs':
            mainContent.innerHTML = renderManageJobs();
            break;
        default:
            mainContent.innerHTML = renderLandingPage();
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Landing Page
function renderLandingPage() {
    const featuredJobs = state.jobs.slice(0, 3);
    
    return `
        <div>
            <!-- Hero Section -->
            <section class="hero">
                <div class="hero-bg">
                    <div class="hero-overlay"></div>
                </div>
                
                <div class="hero-content container">
                    <h1>Find Your Path to Success</h1>
                    <p class="hero-text">
                        Connect with top employers, build essential skills, and land your dream job with PathFinder
                    </p>
                    
                    <div class="search-bar">
                        <div class="search-input-wrapper">
                            <i data-lucide="search"></i>
                            <input type="text" class="search-input" placeholder="Search jobs by title, skill, or location">
                        </div>
                        <button class="btn btn-primary" onclick="navigateTo('job-listings')">
                            Search Jobs
                        </button>
                    </div>
                </div>
            </section>

            <!-- Quick Links -->
            <section class="section section-gray">
                <div class="container">
                    <div class="grid grid-cols-1 grid-cols-md-3">
                        <div class="card" style="cursor: pointer;" onclick="navigateTo('job-listings')">
                            <div class="card-content text-center">
                                <div class="icon-circle icon-circle-blue">
                                    <i data-lucide="briefcase"></i>
                                </div>
                                <h3 class="mb-2">Browse Jobs</h3>
                                <p class="text-gray">
                                    Explore thousands of job opportunities from trusted employers
                                </p>
                            </div>
                        </div>

                        <div class="card" style="cursor: pointer;" onclick="navigateTo('skillbuild')">
                            <div class="card-content text-center">
                                <div class="icon-circle icon-circle-green">
                                    <i data-lucide="trending-up"></i>
                                </div>
                                <h3 class="mb-2">SkillBuild</h3>
                                <p class="text-gray">
                                    Enhance your skills with our interactive learning modules
                                </p>
                            </div>
                        </div>

                        <div class="card" style="cursor: pointer;" onclick="navigateTo('login')">
                            <div class="card-content text-center">
                                <div class="icon-circle icon-circle-purple">
                                    <i data-lucide="users"></i>
                                </div>
                                <h3 class="mb-2">Employer Portal</h3>
                                <p class="text-gray">
                                    Post jobs and find the perfect candidates for your company
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Featured Jobs -->
            <section class="section section-white">
                <div class="container">
                    <div class="text-center mb-12">
                        <h2 class="mb-4">Featured Job Opportunities</h2>
                        <p class="text-gray">
                            Start your career journey with these top positions
                        </p>
                    </div>

                    <div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 mb-8">
                        ${featuredJobs.map(job => `
                            <div class="card">
                                <div class="card-header">
                                    <div class="job-header">
                                        <div class="job-icon">
                                            <i data-lucide="briefcase"></i>
                                        </div>
                                        <span class="badge badge-green">${job.type}</span>
                                    </div>
                                    <h3 class="mb-2">${job.title}</h3>
                                    <p class="text-gray">${job.company}</p>
                                </div>
                                <div class="card-content">
                                    <div class="job-info">
                                        <i data-lucide="map-pin"></i>
                                        <span>${job.location}</span>
                                    </div>
                                    <div class="job-info">
                                        <i data-lucide="briefcase"></i>
                                        <span>${job.salary}</span>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <button class="btn btn-primary btn-full" onclick="navigateTo('job-listings')">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="text-center">
                        <button class="btn btn-secondary btn-lg" onclick="navigateTo('job-listings')">
                            View All Jobs
                        </button>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            ${renderFooter()}
        </div>
    `;
}

// Footer
function renderFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4">
                    <div>
                        <h4>About PathFinder</h4>
                        <p style="color: #9ca3af;">
                            PathFinder connects job seekers with employers and provides skill-building resources to help you succeed in your career.
                        </p>
                    </div>

                    <div>
                        <h4>Quick Links</h4>
                        <ul class="footer-links">
                            <li><button onclick="navigateTo('job-listings')">Browse Jobs</button></li>
                            <li><button onclick="navigateTo('skillbuild')">SkillBuild</button></li>
                            <li><button onclick="navigateTo('login')">Employer Portal</button></li>
                            <li><button onclick="navigateTo('register')">Register</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact Us</h4>
                        <ul class="footer-links">
                            <li style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="mail" style="width: 1rem; height: 1rem;"></i>
                                <span>contact@pathfinder.com</span>
                            </li>
                            <li style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="phone" style="width: 1rem; height: 1rem;"></i>
                                <span>+63 912 345 6789</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4>Help & Support</h4>
                        <ul class="footer-links">
                            <li style="display: flex; align-items: center; gap: 0.5rem;">
                                <i data-lucide="help-circle" style="width: 1rem; height: 1rem;"></i>
                                <span>FAQ</span>
                            </li>
                            <li>Terms of Service</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-divider">
                    <p>&copy; 2025 PathFinder. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
}

// Login Page
function renderLoginPage() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h2 class="auth-title text-center">Login to PathFinder</h2>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="login-email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="login-password" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Login as</label>
                        <select class="form-select" id="login-type">
                            <option value="jobseeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full btn-lg">Login</button>
                </form>
                <div class="auth-toggle">
                    Don't have an account? <button onclick="navigateTo('register')">Register here</button>
                </div>
            </div>
        </div>
    `;
}

// Register Page
function renderRegisterPage() {
    return `
        <div class="auth-container">
            <div class="auth-card">
                <h2 class="auth-title text-center">Create Your Account</h2>
                <form onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-input" id="register-name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="register-email" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" id="register-password" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Register as</label>
                        <select class="form-select" id="register-type">
                            <option value="jobseeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full btn-lg">Register</button>
                </form>
                <div class="auth-toggle">
                    Already have an account? <button onclick="navigateTo('login')">Login here</button>
                </div>
            </div>
        </div>
    `;
}

// Job Listings
function renderJobListings() {
    return `
        <div class="section">
            <div class="container">
                <h2 class="mb-8">Browse Job Opportunities</h2>
                <div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
                    ${state.jobs.map(job => `
                        <div class="card">
                            <div class="card-header">
                                <div class="job-header">
                                    <div class="job-icon">
                                        <i data-lucide="briefcase"></i>
                                    </div>
                                    <span class="badge badge-green">${job.type}</span>
                                </div>
                                <h3 class="mb-2">${job.title}</h3>
                                <p class="text-gray">${job.company}</p>
                            </div>
                            <div class="card-content">
                                <p class="text-gray mb-4">${job.description}</p>
                                <div class="job-info">
                                    <i data-lucide="map-pin"></i>
                                    <span>${job.location}</span>
                                </div>
                                <div class="job-info">
                                    <i data-lucide="briefcase"></i>
                                    <span>${job.salary}</span>
                                </div>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-full" onclick="applyToJob('${job.id}')">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Job Seeker Dashboard
function renderJobSeekerDashboard() {
    return `
        <div class="dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h2>Welcome back, ${state.user?.name || 'Job Seeker'}!</h2>
                    <p class="text-gray">Track your applications and continue building your skills</p>
                </div>

                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-label">Active Applications</div>
                        <div class="stat-value">${state.applications.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Skills Completed</div>
                        <div class="stat-value">${state.user?.skills?.length || 0}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Profile Views</div>
                        <div class="stat-value">45</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 grid-cols-md-2">
                    <div class="card" style="cursor: pointer;" onclick="navigateTo('job-listings')">
                        <div class="card-content">
                            <h3 class="mb-4">Browse Jobs</h3>
                            <p class="text-gray">Find your next opportunity</p>
                        </div>
                    </div>
                    <div class="card" style="cursor: pointer;" onclick="navigateTo('skillbuild')">
                        <div class="card-content">
                            <h3 class="mb-4">Build Skills</h3>
                            <p class="text-gray">Enhance your capabilities</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Employer Dashboard
function renderEmployerDashboard() {
    return `
        <div class="dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h2>Welcome back, ${state.user?.name || 'Employer'}!</h2>
                    <p class="text-gray">Manage your job postings and review applicants</p>
                </div>

                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-label">Active Jobs</div>
                        <div class="stat-value">${state.jobs.filter(j => j.postedBy === state.user?.id).length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Applicants</div>
                        <div class="stat-value">127</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Pending Reviews</div>
                        <div class="stat-value">23</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 grid-cols-md-2">
                    <div class="card" style="cursor: pointer;" onclick="navigateTo('post-job')">
                        <div class="card-content">
                            <h3 class="mb-4">Post a Job</h3>
                            <p class="text-gray">Create a new job listing</p>
                        </div>
                    </div>
                    <div class="card" style="cursor: pointer;" onclick="navigateTo('manage-jobs')">
                        <div class="card-content">
                            <h3 class="mb-4">Manage Jobs</h3>
                            <p class="text-gray">View and edit your postings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// SkillBuild Home
function renderSkillBuildHome() {
    const skills = [
        { id: 'communication', name: 'Communication Skills', icon: 'message-square' },
        { id: 'it-literacy', name: 'IT Literacy', icon: 'monitor' },
        { id: 'customer-service', name: 'Customer Service', icon: 'users' },
        { id: 'workplace-etiquette', name: 'Workplace Etiquette', icon: 'briefcase' }
    ];

    return `
        <div class="section">
            <div class="container">
                <h2 class="mb-4 text-center">Build Essential Skills</h2>
                <p class="text-center text-gray mb-12">Choose a skill module to get started</p>

                <div class="skills-grid">
                    ${skills.map(skill => `
                        <div class="skill-card" onclick="selectSkill('${skill.id}', '${skill.name}')">
                            <div class="skill-icon">
                                <i data-lucide="${skill.icon}"></i>
                            </div>
                            <h3>${skill.name}</h3>
                            <p class="text-gray mt-4">Start Learning</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Skill Module
function renderSkillModule() {
    return `
        <div class="section">
            <div class="container">
                <button class="btn btn-secondary mb-8" onclick="navigateTo('skillbuild')">
                    <i data-lucide="arrow-left"></i> Back to Skills
                </button>

                <h2 class="mb-8">${state.selectedSkill || 'Skill'} Module</h2>

                <div class="card mb-8">
                    <div class="card-content">
                        <h3 class="mb-4">Introduction</h3>
                        <p class="text-gray">
                            This module will teach you essential ${state.selectedSkill?.toLowerCase()} skills that are crucial in today's workplace.
                        </p>
                    </div>
                </div>

                <div class="card mb-8">
                    <div class="card-content">
                        <h3 class="mb-4">Module Progress</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 30%"></div>
                        </div>
                        <p class="text-gray mt-4">30% Complete</p>
                    </div>
                </div>

                <div class="text-center">
                    <button class="btn btn-primary btn-lg" onclick="navigateTo('assessment')">
                        Take Assessment
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Assessment
function renderAssessment() {
    return `
        <div class="section">
            <div class="container">
                <h2 class="mb-8 text-center">Skill Assessment</h2>

                <div class="quiz-question">
                    <h3 class="mb-6">Question 1 of 5</h3>
                    <p class="mb-6">What is the most important aspect of effective communication?</p>
                    <div class="quiz-options">
                        <button class="quiz-option" onclick="selectAnswer(this)">
                            A) Speaking loudly
                        </button>
                        <button class="quiz-option" onclick="selectAnswer(this)">
                            B) Active listening
                        </button>
                        <button class="quiz-option" onclick="selectAnswer(this)">
                            C) Using complex words
                        </button>
                        <button class="quiz-option" onclick="selectAnswer(this)">
                            D) Talking fast
                        </button>
                    </div>
                </div>

                <div class="text-center">
                    <button class="btn btn-primary btn-lg" onclick="completeAssessment()">
                        Submit Assessment
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Application Status
function renderApplicationStatus() {
    return `
        <div class="section">
            <div class="container">
                <h2 class="mb-8">My Applications</h2>

                ${state.applications.length === 0 ? `
                    <div class="card">
                        <div class="card-content text-center">
                            <p class="text-gray">You haven't applied to any jobs yet.</p>
                            <button class="btn btn-primary mt-8" onclick="navigateTo('job-listings')">
                                Browse Jobs
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Company</th>
                                    <th>Applied Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.applications.map(app => `
                                    <tr>
                                        <td>${app.jobTitle}</td>
                                        <td>${app.company}</td>
                                        <td>${app.appliedDate}</td>
                                        <td><span class="badge badge-green">${app.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Post Job
function renderPostJob() {
    return `
        <div class="section">
            <div class="container" style="max-width: 800px;">
                <h2 class="mb-8">Post a New Job</h2>

                <form onsubmit="handlePostJob(event)" class="card">
                    <div class="card-content">
                        <div class="form-group">
                            <label class="form-label">Job Title</label>
                            <input type="text" class="form-input" id="job-title" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Company</label>
                            <input type="text" class="form-input" id="job-company" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Location</label>
                            <input type="text" class="form-input" id="job-location" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Salary Range</label>
                            <input type="text" class="form-input" id="job-salary" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Job Type</label>
                            <select class="form-select" id="job-type" required>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-textarea" id="job-description" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Requirements</label>
                            <textarea class="form-textarea" id="job-requirements" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full btn-lg">Post Job</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Manage Jobs
function renderManageJobs() {
    const userJobs = state.jobs.filter(j => j.postedBy === state.user?.id);

    return `
        <div class="section">
            <div class="container">
                <h2 class="mb-8">Manage Your Jobs</h2>

                ${userJobs.length === 0 ? `
                    <div class="card">
                        <div class="card-content text-center">
                            <p class="text-gray">You haven't posted any jobs yet.</p>
                            <button class="btn btn-primary mt-8" onclick="navigateTo('post-job')">
                                Post a Job
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="grid grid-cols-1">
                        ${userJobs.map(job => `
                            <div class="card">
                                <div class="card-content">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div>
                                            <h3>${job.title}</h3>
                                            <p class="text-gray">${job.company}</p>
                                        </div>
                                        <span class="badge badge-green">${job.status}</span>
                                    </div>
                                    <div class="mt-8">
                                        <button class="btn btn-primary">View Applicants</button>
                                        <button class="btn btn-secondary" style="margin-left: 0.5rem;">Edit</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
}

// Event Handlers
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const type = document.getElementById('login-type').value;
    
    state.user = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        type: type,
        skills: []
    };
    
    if (type === 'jobseeker') {
        navigateTo('jobseeker-dashboard');
    } else {
        navigateTo('employer-dashboard');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const type = document.getElementById('register-type').value;
    
    state.user = {
        id: Date.now().toString(),
        name: name,
        email: email,
        type: type,
        skills: []
    };
    
    if (type === 'jobseeker') {
        navigateTo('jobseeker-dashboard');
    } else {
        navigateTo('employer-dashboard');
    }
}

function applyToJob(jobId) {
    if (!state.user) {
        navigateTo('login');
        return;
    }
    
    const job = state.jobs.find(j => j.id === jobId);
    if (job) {
        state.applications.push({
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            appliedDate: new Date().toLocaleDateString(),
            status: 'Under Review'
        });
        alert('Application submitted successfully!');
    }
}

function selectSkill(skillId, skillName) {
    state.selectedSkill = skillName;
    navigateTo('skill-module');
}

function selectAnswer(element) {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
}

function completeAssessment() {
    alert('Assessment completed! You earned a certificate.');
    if (state.user) {
        state.user.skills = state.user.skills || [];
        state.user.skills.push(state.selectedSkill);
    }
    navigateTo('skillbuild');
}

function handlePostJob(event) {
    event.preventDefault();
    
    const newJob = {
        id: Date.now().toString(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        salary: document.getElementById('job-salary').value,
        type: document.getElementById('job-type').value,
        description: document.getElementById('job-description').value,
        requirements: document.getElementById('job-requirements').value,
        skills: [],
        postedBy: state.user?.id,
        postedDate: new Date().toLocaleDateString(),
        status: 'open'
    };
    
    state.jobs.push(newJob);
    alert('Job posted successfully!');
    navigateTo('manage-jobs');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderPage();
});
