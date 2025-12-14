import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Briefcase, BookOpen, FileText, LogOut, Settings, User } from 'lucide-react';

export function JobSeekerDashboard() {
  const { user, setCurrentPage, applications, jobs } = useApp();

  if (!user || user.type !== 'jobseeker') {
    return null;
  }

  // Calculate stats
  const totalApplications = applications.filter(app => app.applicantId === user.id).length;
  const pendingApplications = applications.filter(
    app => app.applicantId === user.id && app.status === 'Pending'
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentPage('job-listings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span>Browse Jobs</span>
          </button>

          <button
            onClick={() => setCurrentPage('application-status')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>My Applications</span>
          </button>

          <button
            onClick={() => setCurrentPage('skillbuild')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>SkillBuild</span>
          </button>

          <button
            onClick={() => setCurrentPage('jobseeker-profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Here&apos;s your job search overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Available Jobs</span>
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-blue-600">{jobs.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">My Applications</span>
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-green-600">{totalApplications}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Pending Reviews</span>
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-orange-600">{pendingApplications}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <div className="mb-8">
          <h2 className="mb-4">Recent Job Postings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.slice(0, 4).map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-500 text-sm mb-3">{job.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">{job.salary}</span>
                    <Button 
                      onClick={() => {
                        setCurrentPage('job-listings');
                      }}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {applications.filter(app => app.applicantId === user.id).length > 0 && (
          <div>
            <h2 className="mb-4">Recent Applications</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {applications
                    .filter(app => app.applicantId === user.id)
                    .slice(0, 5)
                    .map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                          <div>
                            <p className="mb-1">{job?.title || 'Job'}</p>
                            <p className="text-gray-600 text-sm">{job?.company || 'Company'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                              app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                            <p className="text-gray-500 text-sm mt-1">{new Date(app.appliedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}