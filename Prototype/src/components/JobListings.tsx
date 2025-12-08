import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, MapPin, Briefcase, Filter, DollarSign, X, FileText } from 'lucide-react';

export function JobListings() {
  const { jobs, setSelectedJob, setCurrentPage, user, hasResume, applications, setApplications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedJobDetail, setSelectedJobDetail] = useState<any>(null);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // Get unique values for filters
  const locations = ['all', ...Array.from(new Set(jobs.map(job => job.location)))];
  const jobTypes = ['all', 'Full-time', 'Part-time', 'Remote'];
  const skills = ['all', 'Communication', 'IT Literacy', 'Customer Service', 'Basic English', 'Workplace Etiquette'];

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    const matchesJobType = jobTypeFilter === 'all' || job.type === jobTypeFilter;
    const matchesSkill = skillFilter === 'all' || job.skills.includes(skillFilter);

    return matchesSearch && matchesLocation && matchesJobType && matchesSkill;
  });

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setSelectedJobDetail(job);
  };

  const handleApplyClick = () => {
    if (!user) {
      setCurrentPage('login');
      return;
    }

    if (!hasResume) {
      setShowResumeDialog(true);
      return;
    }

    // Add application
    const newApplication = {
      id: `app-${Date.now()}`,
      jobId: selectedJobDetail.id,
      jobTitle: selectedJobDetail.title,
      company: selectedJobDetail.company,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setApplications([...applications, newApplication]);
    setSelectedJobDetail(null);
    setCurrentPage('application-status');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Find Your Perfect Job</h1>
        <p className="text-gray-600">
          Browse through {jobs.length} available job opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 border border-gray-300 rounded-md">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs by title, skill, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Type
                </label>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Skills Required
                </label>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Skills" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map(skill => (
                      <SelectItem key={skill} value={skill}>
                        {skill === 'all' ? 'All Skills' : skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span>{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  job.type === 'Full-time' ? 'bg-green-50 text-green-600' :
                  job.type === 'Part-time' ? 'bg-blue-50 text-blue-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {job.type}
                </span>
              </div>
              <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
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

              <div>
                <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {job.description}
              </p>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => handleJobClick(job)}
              >
                View Details
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleJobClick(job)}
              >
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              No jobs found matching your criteria
            </p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or search terms
            </p>
          </CardContent>
        </Card>
      )}

      {user && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(user.type === 'employer' ? 'employer-dashboard' : 'jobseeker-dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      )}

      {/* Job Detail Dialog */}
      {selectedJobDetail && (
        <Dialog open={!!selectedJobDetail} onOpenChange={() => setSelectedJobDetail(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <DialogTitle className="mb-2">{selectedJobDetail.title}</DialogTitle>
                  <DialogDescription>{selectedJobDetail.company}</DialogDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedJobDetail.type === 'Full-time' ? 'bg-green-50 text-green-600' :
                  selectedJobDetail.type === 'Part-time' ? 'bg-blue-50 text-blue-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {selectedJobDetail.type}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedJobDetail.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{selectedJobDetail.salary}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-2">Job Description</h3>
                <p className="text-gray-600">{selectedJobDetail.description}</p>
              </div>

              <div>
                <h3 className="mb-2">Requirements</h3>
                <p className="text-gray-600">{selectedJobDetail.requirements}</p>
              </div>

              <div>
                <h3 className="mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJobDetail.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Posted on {new Date(selectedJobDetail.postedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setSelectedJobDetail(null)}
              >
                Close
              </Button>
              <Button 
                onClick={handleApplyClick}
              >
                Apply Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Resume Warning Dialog */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Upload Resume to Continue
            </DialogTitle>
            <DialogDescription>
              You need to upload a resume before applying for jobs.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600">
              Please go to your profile and upload your resume to start applying for positions.
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowResumeDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowResumeDialog(false);
                setCurrentPage('jobseeker-profile');
              }}
            >
              Go to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}