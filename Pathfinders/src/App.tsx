import { useState, createContext, useContext } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { JobSeekerDashboard } from './components/JobSeekerDashboard';
import { JobSeekerProfile } from './components/JobSeekerProfile';
import { JobListings } from './components/JobListings';
import { ApplicationStatus } from './components/ApplicationStatus';
import { SkillBuildHome } from './components/SkillBuildHome';
import { SkillModule } from './components/SkillModule';
import { Assessment } from './components/Assessment';
import { EmployerDashboard } from './components/EmployerDashboard';
import { EmployerProfile } from './components/EmployerProfile';
import { PostJob } from './components/PostJob';
import { ManageJobs } from './components/ManageJobs';
import { ViewApplicants } from './components/ViewApplicants';
import { ManageLessons } from './components/ManageLessons';
import { CreateLesson } from './components/CreateLesson';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  skills: string[];
  postedDate: string;
  postedBy: string;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  user: null | Record<string, unknown>;
  setUser: React.Dispatch<React.SetStateAction<null | Record<string, unknown>>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  applications: unknown[];
  setApplications: React.Dispatch<React.SetStateAction<unknown[]>>;
  employerLessons: unknown[];
  setEmployerLessons: React.Dispatch<React.SetStateAction<unknown[]>>;
  selectedJob: null | Record<string, unknown>;
  setSelectedJob: React.Dispatch<React.SetStateAction<null | Record<string, unknown>>>;
  selectedModule: null | Record<string, unknown>;
  setSelectedModule: React.Dispatch<React.SetStateAction<null | Record<string, unknown>>>;
  selectedLesson: null | Record<string, unknown>;
  setSelectedLesson: React.Dispatch<React.SetStateAction<null | Record<string, unknown>>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  addNotification: (userId: string, type: string, title: string, message: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  hasResume: boolean;
  setHasResume: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  return useContext(AppContext);
};

export default function App() {
  // Navigation & User
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState<null | Record<string, unknown>>(null);
  
  // Selected items
  const [selectedJob, setSelectedJob] = useState<null | Record<string, unknown>>(null);
  const [selectedModule, setSelectedModule] = useState<null | Record<string, unknown>>(null);
  const [selectedLesson, setSelectedLesson] = useState<null | Record<string, unknown>>(null);

  // Resume state
  const [hasResume, setHasResume] = useState(false);

  // Data states (will be populated from backend later)
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Cebu',
      location: 'Cebu City, Cebu',
      type: 'Full-time',
      salary: '₱80,000 - ₱120,000',
      description: 'We are seeking an experienced software engineer to join our team in Cebu IT Park.',
      requirements: 'Bachelor\'s degree in Computer Science, 5+ years experience',
      skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      postedDate: '2024-01-15',
      postedBy: 'employer1'
    },
    {
      id: '2',
      title: 'Marketing Manager',
      company: 'Brand Dynamics Philippines',
      location: 'Cebu Business Park, Cebu City',
      type: 'Full-time',
      salary: '₱60,000 - ₱85,000',
      description: 'Looking for a creative marketing manager to lead our campaigns in Cebu.',
      requirements: '3+ years in marketing, excellent communication skills',
      skills: ['SEO', 'Content Strategy', 'Analytics', 'Social Media'],
      postedDate: '2024-01-18',
      postedBy: 'employer2'
    },
    {
      id: '3',
      title: 'Data Analyst',
      company: 'DataCorp Cebu',
      location: 'Cebu IT Park, Cebu City',
      type: 'Full-time',
      salary: '₱50,000 - ₱70,000',
      description: 'Join our analytics team to drive data-driven decisions at our Cebu office.',
      requirements: 'Strong analytical skills, proficiency in SQL and Python',
      skills: ['SQL', 'Python', 'Tableau', 'Excel'],
      postedDate: '2024-01-20',
      postedBy: 'employer1'
    },
    {
      id: '4',
      title: 'UX/UI Designer',
      company: 'Creative Studios Cebu',
      location: 'Mandaue City, Cebu',
      type: 'Contract',
      salary: '₱55,000 - ₱75,000',
      description: 'Design beautiful and intuitive user interfaces for web applications.',
      requirements: 'Portfolio required, 2+ years experience with design tools',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      postedDate: '2024-01-22',
      postedBy: 'employer3'
    },
    {
      id: '5',
      title: 'Customer Success Manager',
      company: 'SaaS Innovations Cebu',
      location: 'Cebu City, Cebu',
      type: 'Full-time',
      salary: '₱45,000 - ₱65,000',
      description: 'Help our customers achieve success with our platform from our Cebu office.',
      requirements: 'Experience in customer-facing roles, excellent problem-solving',
      skills: ['Communication', 'CRM Software', 'Customer Support', 'Training'],
      postedDate: '2024-01-25',
      postedBy: 'employer2'
    }
  ]);
  const [applications, setApplications] = useState<unknown[]>([]);
  const [employerLessons, setEmployerLessons] = useState<unknown[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Helper functions
  const addNotification = (userId: string, type: string, title: string, message: string) => {
    const newNotification = {
      id: String(Date.now()),
      userId,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? {...n, read: true} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  // Context value
  const appData = {
    currentPage: page,
    setCurrentPage: setPage,
    user,
    setUser,
    jobs,
    setJobs,
    applications,
    setApplications,
    employerLessons,
    setEmployerLessons,
    selectedJob,
    setSelectedJob,
    selectedModule,
    setSelectedModule,
    selectedLesson,
    setSelectedLesson,
    notifications,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    hasResume,
    setHasResume
  };

  return (
    <AppContext.Provider value={appData}>
      <div className="min-h-screen bg-gray-50">
        {page !== 'login' && page !== 'register' && <Header />}
        
        {page === 'landing' && <LandingPage />}
        {page === 'login' && <LoginPage />}
        {page === 'register' && <RegisterPage />}
        {page === 'jobseeker-dashboard' && <JobSeekerDashboard />}
        {page === 'jobseeker-profile' && <JobSeekerProfile />}
        {page === 'job-listings' && <JobListings />}
        {page === 'application-status' && <ApplicationStatus />}
        {page === 'skillbuild' && <SkillBuildHome />}
        {page === 'skill-module' && <SkillModule />}
        {page === 'assessment' && <Assessment />}
        {page === 'employer-dashboard' && <EmployerDashboard />}
        {page === 'employer-profile' && <EmployerProfile />}
        {page === 'post-job' && <PostJob />}
        {page === 'manage-jobs' && <ManageJobs />}
        {page === 'view-applicants' && <ViewApplicants />}
        {page === 'manage-lessons' && <ManageLessons />}
        {page === 'create-lesson' && <CreateLesson />}
      </div>
    </AppContext.Provider>
  );
}