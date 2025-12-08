import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Briefcase, MapPin, DollarSign, Edit, Trash2, XCircle, Calendar, ArrowLeft } from 'lucide-react';

export function ManageJobs() {
  const { setCurrentPage, jobs, setJobs, user } = useApp();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobToDelete, setJobToDelete] = useState<any>(null);

  if (!user || user.type !== 'employer') {
    return null;
  }

  // Get employer's jobs
  const employerJobs = jobs.filter(job => job.postedBy === user.id || job.company === user.company);

  const handleCloseJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'closed' } : job
    ));
    setSelectedJob(null);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    setJobToDelete(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'open' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setCurrentPage('employer-dashboard')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">Manage Job Postings</h1>
            <p className="text-gray-600">
              View, edit, or close your active job postings
            </p>
          </div>
          <Button onClick={() => setCurrentPage('post-job')}>
            Post New Job
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      {employerJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="mb-2">No Job Postings Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first job posting
            </p>
            <Button onClick={() => setCurrentPage('post-job')}>
              Post a Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {employerJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{job.title}</h3>
                        <Badge className={`${getStatusColor(job.status)} border-0`}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{job.company}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Posted {new Date(job.postedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 4).map((skill: string) => (
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
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage('view-applicants')}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Applicants
                  </Button>
                  {job.status === 'open' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCloseJob(job.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Close Job
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setJobToDelete(job)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <DialogTitle className="mb-2">{selectedJob.title}</DialogTitle>
                  <DialogDescription>{selectedJob.company}</DialogDescription>
                </div>
                <Badge className={`${getStatusColor(selectedJob.status)} border-0`}>
                  {selectedJob.status}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{selectedJob.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{selectedJob.type}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-2">Job Description</h3>
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="mb-2">Requirements</h3>
                <p className="text-gray-600">{selectedJob.requirements}</p>
              </div>

              <div>
                <h3 className="mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill: string) => (
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
                  Posted on {new Date(selectedJob.postedDate).toLocaleDateString('en-US', {
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
                onClick={() => setSelectedJob(null)}
              >
                Close
              </Button>
              <Button onClick={() => setCurrentPage('view-applicants')}>
                View Applicants
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {jobToDelete && (
        <Dialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Delete Job Posting?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the job posting.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <p className="text-gray-600 mb-2">
                You are about to delete:
              </p>
              <p className="text-gray-900">{jobToDelete.title}</p>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setJobToDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleDeleteJob(jobToDelete.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
