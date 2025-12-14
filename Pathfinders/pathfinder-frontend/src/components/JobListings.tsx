import { useState } from 'react';
import { useApp } from '../../../src/App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, MapPin, Briefcase, DollarSign, FileText } from 'lucide-react';

export function JobListings() {
  const appContext = useApp();
  if (!appContext) return null;
  
  const { setCurrentPage, user, jobs, applications, setApplications, addNotification } = appContext;
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [skill, setSkill] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showResumeWarning, setShowResumeWarning] = useState(false);

  // Filter options
  const locations = ['all', ...Array.from(new Set(jobs.map((job: any) => job.location)))];
  const types = ['all', 'Full-time', 'Part-time', 'Remote'];
  const skills = ['all', 'Communication', 'IT Literacy', 'Customer Service', 'Basic English', 'Workplace Etiquette'];

  // Filter jobs based on search and filters
  const filtered = jobs.filter((job: any) => {
    const matchSearch = !search || 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((s: any) => s.toLowerCase().includes(search.toLowerCase()));

    const matchLocation = location === 'all' || job.location === location;
    const matchType = jobType === 'all' || job.type === jobType;
    const matchSkill = skill === 'all' || job.skills.includes(skill);

    return matchSearch && matchLocation && matchType && matchSkill;
  });

  const handleApply = () => {
    if (!user || !selectedJob) {
      setCurrentPage('login');
      return;
    }

    // Check if user has uploaded resume (mock check)
    const hasResume = true; // In real app, check user profile

    if (!hasResume) {
      setShowResumeWarning(true);
      return;
    }

    // Add application
    const newApp = {
      id: String(applications.length + 1),
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      appliedDate: new Date().toLocaleDateString(),
      status: 'Pending'
    };

    setApplications([...applications, newApp]);
    
    // Add notification for job seeker
    addNotification(
      user.id as string,
      'application',
      'Application Submitted',
      `Your application for ${selectedJob.title} at ${selectedJob.company} has been submitted successfully.`
    );
    
    // Add notification for employer (find job poster)
    const job = jobs.find((j: any) => j.id === selectedJob.id);
    if (job && job.postedBy) {
      addNotification(
        job.postedBy,
        'application',
        'New Application Received',
        `${user.name} applied for ${selectedJob.title}.`
      );
    }
    
    setSelectedJob(null);
    setCurrentPage('application-status');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Find Your Next Job</h1>
        <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by job title, company, or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="md:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Location</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Job Type</label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Required Skill</label>
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skills.map(sk => (
                  <SelectItem key={sk} value={sk}>
                    {sk === 'all' ? 'All Skills' : sk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filtered.length} job{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filtered.map((job: any) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="mb-1">{job.title}</CardTitle>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                </div>
                <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                  {job.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>
                <p className="text-gray-600">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: any) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button onClick={() => setSelectedJob(job)} className="flex-1">
                Apply Now
              </Button>
              <Button variant="outline" onClick={() => setSelectedJob(job)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No jobs found matching your criteria</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.company}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{selectedJob?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>{selectedJob?.salary}</span>
              </div>
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                {selectedJob?.type}
              </span>
            </div>

            <div>
              <h3 className="mb-2">Job Description</h3>
              <p className="text-gray-600">{selectedJob?.description}</p>
            </div>

            <div>
              <h3 className="mb-2">Requirements</h3>
              <p className="text-gray-600">{selectedJob?.requirements}</p>
            </div>

            <div>
              <h3 className="mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob?.skills.map((skill: any) => (
                  <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedJob(null)}>
              Close
            </Button>
            <Button onClick={handleApply}>
              Apply for this Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Warning Dialog */}
      <Dialog open={showResumeWarning} onOpenChange={setShowResumeWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume Required</DialogTitle>
            <DialogDescription>
              You need to upload your resume before applying for jobs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Please complete your profile and upload your resume to start applying for jobs.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResumeWarning(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowResumeWarning(false);
              setCurrentPage('jobseeker-profile');
            }}>
              Go to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}