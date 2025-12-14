import React from 'react';
import { useApp } from '../App';
import { Card, CardContent } from './ui/card';
import { Briefcase, Users, PlusCircle, LogOut, Settings, BookOpen } from 'lucide-react';
import { Button } from './ui/button';

export function EmployerDashboard() {
  const { user, setCurrentPage, jobs, applications, employerLessons } = useApp();

  if (!user || user.type !== 'employer') {
    return null;
  }

  // Calculate stats
  const myJobs = jobs.filter(job => job.postedBy === user.id).length;
  const myApplications = applications.filter(app => 
    jobs.some(job => job.id === app.jobId && job.postedBy === user.id)
  ).length;
  const myLessons = employerLessons.filter(lesson => lesson.createdBy === user.id).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentPage('post-job')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post Job</span>
          </button>

          <button
            onClick={() => setCurrentPage('manage-jobs')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            <span>Manage Jobs</span>
          </button>

          <button
            onClick={() => setCurrentPage('view-applicants')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>View Applicants</span>
          </button>

          <button
            onClick={() => setCurrentPage('manage-lessons')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Manage Lessons</span>
          </button>

          <button
            onClick={() => setCurrentPage('employer-profile')}
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
          <h1 className="mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and review applicants</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Active Job Posts</span>
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-blue-600">{myJobs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Applicants</span>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-green-600">{myApplications}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Skill Lessons</span>
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-purple-600">{myLessons}</p>
            </CardContent>
          </Card>
        </div>

        {/* My Posted Jobs */}
        <div className="mb-8">
          <h2 className="mb-4">My Job Postings</h2>
          {jobs.filter(job => job.postedBy === user.id).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.filter(job => job.postedBy === user.id).slice(0, 4).map(job => {
                const jobApplicants = applications.filter(app => app.jobId === job.id).length;
                return (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <h3 className="mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.location}</p>
                      <p className="text-gray-500 text-sm mb-3">{job.type} • {job.salary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600">{jobApplicants} applicant{jobApplicants !== 1 ? 's' : ''}</span>
                        <Button 
                          onClick={() => setCurrentPage('manage-jobs')}
                          size="sm"
                          variant="outline"
                        >
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven&apos;t posted any jobs yet</p>
                <Button onClick={() => setCurrentPage('post-job')}>
                  Post Your First Job
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Applicants */}
        {applications.filter(app => jobs.some(job => job.id === app.jobId && job.postedBy === user.id)).length > 0 && (
          <div>
            <h2 className="mb-4">Recent Applicants</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {applications
                    .filter(app => jobs.some(job => job.id === app.jobId && job.postedBy === user.id))
                    .slice(0, 5)
                    .map(app => {
                      const job = jobs.find(j => j.id === app.jobId);
                      return (
                        <div key={app.id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                          <div>
                            <p className="mb-1">{app.applicantName}</p>
                            <p className="text-gray-600 text-sm">Applied for: {job?.title || 'Job'}</p>
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