import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Briefcase, Users, FileText, TrendingUp, PlusCircle, LogOut, Settings, Clock } from 'lucide-react';

export function EmployerDashboard() {
  const { user, setCurrentPage, jobs } = useApp();

  if (!user || user.type !== 'employer') {
    return null;
  }

  // Get employer's posted jobs
  const employerJobs = jobs.filter(job => job.postedBy === user.id || job.company === user.company);
  const totalJobs = employerJobs.length;
  const activeJobs = employerJobs.filter(job => job.status === 'open').length;

  // Mock applicants data
  const totalApplicants = 24;
  const recentApplicants = [
    {
      id: 1,
      name: 'Maria Santos',
      job: 'Front Desk Officer',
      date: '2025-11-24',
      skills: ['Communication', 'Customer Service', 'IT Literacy']
    },
    {
      id: 2,
      name: 'Juan Dela Cruz',
      job: 'Data Entry Specialist',
      date: '2025-11-23',
      skills: ['IT Literacy', 'Workplace Etiquette']
    },
    {
      id: 3,
      name: 'Ana Reyes',
      job: 'Administrative Assistant',
      date: '2025-11-23',
      skills: ['IT Literacy', 'Communication', 'Workplace Etiquette']
    },
    {
      id: 4,
      name: 'Carlos Garcia',
      job: 'Front Desk Officer',
      date: '2025-11-22',
      skills: ['Communication', 'Customer Service']
    }
  ];

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
            onClick={() => setCurrentPage('employer-profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Profile</span>
          </button>

          <div className="pt-4 border-t border-gray-200 mt-4">
            <button
              onClick={() => {
                setCurrentPage('landing');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">
            Manage your job postings and review applicants
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Posted Jobs</span>
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-blue-600">{totalJobs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Active Jobs</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-green-600">{activeJobs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Applicants</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-purple-600">{totalApplicants}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">New This Week</span>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-orange-600">{recentApplicants.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('post-job')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Post New Job</h3>
                    <p className="text-gray-600 text-sm">Create a new job listing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('view-applicants')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Review Applicants</h3>
                    <p className="text-gray-600 text-sm">View and manage applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('manage-jobs')}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Manage Jobs</h3>
                    <p className="text-gray-600 text-sm">Edit or close job postings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Recent Activity</h2>
            <Button variant="outline" onClick={() => setCurrentPage('view-applicants')}>
              View All
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-start justify-between pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="mb-1">{applicant.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Applied for <span>{applicant.job}</span>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(applicant.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}