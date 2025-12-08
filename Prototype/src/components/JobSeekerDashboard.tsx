import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Briefcase, FileText, TrendingUp, User, LogOut, MapPin, DollarSign } from 'lucide-react';

export function JobSeekerDashboard() {
  const { user, setCurrentPage, applications, jobs } = useApp();

  if (!user || user.type !== 'jobseeker') {
    return null;
  }

  const recommendedJobs = jobs.filter(job => 
    job.skills.some(skill => user.skills?.includes(skill))
  ).slice(0, 3);

  const profileCompleteness = 65;
  const skillsImproved = 2;
  const applicationsSent = applications.length;

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
            <span>Job Listings</span>
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
            <TrendingUp className="w-5 h-5" />
            <span>SkillBuild</span>
          </button>

          <button
            onClick={() => setCurrentPage('jobseeker-profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          >
            <User className="w-5 h-5" />
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
            Continue your job search and enhance your skills
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Applications Sent</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-blue-600">{applicationsSent}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Skills Improved</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-green-600">{skillsImproved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Profile Completeness</span>
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-2">
                <p className="text-purple-600">{profileCompleteness}%</p>
                <Progress value={profileCompleteness} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Recommended Jobs for You</h2>
              <p className="text-gray-600">
                Based on your skills and preferences
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setCurrentPage('job-listings')}
            >
              View All Jobs
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                      Match
                    </span>
                  </div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-gray-600">{job.company}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => setCurrentPage('job-listings')}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {recommendedJobs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No recommended jobs at the moment
                </p>
                <Button onClick={() => setCurrentPage('job-listings')}>
                  Browse All Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}