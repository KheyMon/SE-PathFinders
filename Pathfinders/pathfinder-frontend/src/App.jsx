import React, { Fragment } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { JobSeekerDashboard } from './components/JobSeekerDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { JobSeekerProfile } from './components/JobSeekerProfile';
import { PostJob } from './components/PostJob';
import { ManageJobs } from './components/ManageJobs';
import { ViewApplicants } from './components/ViewApplicants';

// Minimal placeholder hook — replace with your real app context/hook
function useApp() {
    return { currentPage: 'landing', user: null };
}

export function App() {
    const { currentPage, user } = useApp();

    const renderPage = () => {
        if (user && user.type === 'jobseeker') {
            switch (currentPage) {
                case 'jobseeker-dashboard':
                    return <JobSeekerDashboard />;
                case 'jobseeker-profile':
                    return <JobSeekerProfile />;
                default:
                    return <JobSeekerDashboard />;
            }
        }

        if (user && user.type === 'employer') {
            switch (currentPage) {
                case 'employer-dashboard':
                    return <EmployerDashboard />;
                case 'post-job':
                    return <PostJob />;
                case 'manage-jobs':
                    return <ManageJobs />;
                case 'view-applicants':
                    return <ViewApplicants />;
                default:
                    return <EmployerDashboard />;
            }
        }

        switch (currentPage) {
            case 'login':
                return <LoginPage />;
            case 'register':
                return <RegisterPage />;
            case 'landing':
            default:
                return <LandingPage />;
        }
    };

    return (
        <Fragment>
            <div className="App-Container">
                <main>{renderPage()}</main>
            </div>
        </Fragment>
    );
}