import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { FileText, Calendar, Briefcase, Building2 } from 'lucide-react';

export function ApplicationStatus() {
  const { setCurrentPage, applications, jobs } = useApp();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobDetails = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">My Applications</h1>
        <p className="text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't applied to any jobs yet. Start exploring opportunities!
              </p>
              <Button onClick={() => setCurrentPage('job-listings')}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => {
            const jobDetails = getJobDetails(application.jobId);
            
            return (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="mb-1">{application.jobTitle}</h3>
                          <p className="text-gray-600">{application.company}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} border-0`}>
                      {application.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Applied on {new Date(application.appliedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {jobDetails && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{jobDetails.location}</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedApplication({ ...application, jobDetails })}
                    className="w-full md:w-auto"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Back to Dashboard Button */}
      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => setCurrentPage('jobseeker-dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <DialogTitle className="mb-2">
                    {selectedApplication.jobTitle}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedApplication.company}
                  </DialogDescription>
                </div>
                <Badge className={`${getStatusColor(selectedApplication.status)} border-0`}>
                  {selectedApplication.status}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-3">Application Information</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Applied on {new Date(selectedApplication.appliedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Application ID: {selectedApplication.id}</span>
                  </div>
                </div>
              </div>

              {selectedApplication.jobDetails && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="mb-3">Job Details</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedApplication.jobDetails.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm mb-2">Location</p>
                        <p className="text-gray-600">
                          {selectedApplication.jobDetails.location}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm mb-2">Salary Range</p>
                        <p className="text-gray-600">
                          {selectedApplication.jobDetails.salary}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm mb-2">Job Type</p>
                        <p className="text-gray-600">
                          {selectedApplication.jobDetails.type}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.jobDetails.skills.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {selectedApplication.status === 'Pending' && (
                      <p className="text-blue-800 text-sm">
                        Your application is under review. The employer will contact you if you're selected for an interview.
                      </p>
                    )}
                    {selectedApplication.status === 'Accepted' && (
                      <p className="text-green-800 text-sm">
                        Congratulations! Your application has been accepted. The employer will reach out to you soon.
                      </p>
                    )}
                    {selectedApplication.status === 'Rejected' && (
                      <p className="text-red-800 text-sm">
                        Unfortunately, your application was not selected this time. Keep applying to other opportunities!
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setSelectedApplication(null);
                  setCurrentPage('job-listings');
                }}
              >
                Browse More Jobs
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
