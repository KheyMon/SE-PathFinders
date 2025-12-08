import React, { useState, createContext, useContext } from 'react';
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

type UserType = 'jobseeker' | 'employer' | null;

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  skills?: string[];
  company?: string;
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  applications: any[];
  setApplications: (applications: any[]) => void;
  jobs: any[];
  setJobs: (jobs: any[]) => void;
  selectedJob: any;
  setSelectedJob: (job: any) => void;
  hasResume: boolean;
  setHasResume: (hasResume: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([
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
  ]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);

  const contextValue: AppContextType = {
    currentPage,
    setCurrentPage,
    user,
    setUser,
    applications,
    setApplications,
    jobs,
    setJobs,
    selectedJob,
    setSelectedJob,
    hasResume,
    setHasResume
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        {currentPage !== 'login' && currentPage !== 'register' && <Header />}
        
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'register' && <RegisterPage />}
        {currentPage === 'jobseeker-dashboard' && <JobSeekerDashboard />}
        {currentPage === 'jobseeker-profile' && <JobSeekerProfile />}
        {currentPage === 'job-listings' && <JobListings />}
        {currentPage === 'application-status' && <ApplicationStatus />}
        {currentPage === 'skillbuild' && <SkillBuildHome />}
        {currentPage === 'skill-module' && <SkillModule />}
        {currentPage === 'assessment' && <Assessment />}
        {currentPage === 'employer-dashboard' && <EmployerDashboard />}
        {currentPage === 'employer-profile' && <EmployerProfile />}
        {currentPage === 'post-job' && <PostJob />}
        {currentPage === 'manage-jobs' && <ManageJobs />}
        {currentPage === 'view-applicants' && <ViewApplicants />}
      </div>
    </AppContext.Provider>
  );
}