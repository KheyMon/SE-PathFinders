import React, { useState } from 'react';
import { useApp } from '../../../src/App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Search, MapPin, Briefcase, TrendingUp, Users, Mail, Phone, HelpCircle } from 'lucide-react';

export function LandingPage() {
  const { setCurrentPage, jobs, user } = useApp();
  const [search, setSearch] = useState('');

  const topJobs = jobs.slice(0, 3);

  const handleEmployerPortal = () => {
    // Always go to post-job page, regardless of login status
    setCurrentPage('post-job');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">Find Your Path to Success</h1>
            <p className="text-blue-100 mb-8 text-lg">
              Connect with top employers, build essential skills, and land your dream job with PathFinder
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex gap-2 shadow-lg max-w-2xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs by title, skill, or location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button onClick={() => setCurrentPage('job-listings')} className="bg-blue-600 hover:bg-blue-700">
                Search Jobs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('job-listings')}>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2">Browse Jobs</h3>
                <p className="text-gray-600">
                  Explore thousands of job opportunities from trusted employers
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('skillbuild')}>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="mb-2">SkillBuild</h3>
                <p className="text-gray-600">
                  Enhance your skills with our interactive learning modules
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleEmployerPortal}>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="mb-2">Employer Portal</h3>
                <p className="text-gray-600">
                  Post jobs and find the perfect candidates for your company
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Featured Job Opportunities</h2>
            <p className="text-gray-600">
              Start your career journey with these top positions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {topJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="mb-1">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setCurrentPage('job-listings')}>
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => setCurrentPage('job-listings')}>
              View All Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h4 className="mb-4">About PathFinder</h4>
              <p className="text-gray-400">
                PathFinder connects job seekers with employers and provides skill-building resources to help you succeed in your career.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => setCurrentPage('job-listings')} className="hover:text-white transition-colors">
                    Browse Jobs
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('skillbuild')} className="hover:text-white transition-colors">
                    SkillBuild
                  </button>
                </li>
                <li>
                  <button onClick={handleEmployerPortal} className="hover:text-white transition-colors">
                    Employer Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentPage('register')} className="hover:text-white transition-colors">
                    Register
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@pathfinder.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+63 912 345 6789</span>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="mb-4">Help & Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>FAQ</span>
                </li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PathFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}