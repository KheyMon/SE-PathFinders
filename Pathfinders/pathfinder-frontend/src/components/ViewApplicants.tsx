import React, { useState } from 'react';
import { useApp } from '../../../src/App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Users, Mail, Phone, MapPin, Briefcase, ArrowLeft, FileText } from 'lucide-react';

export function ViewApplicants() {
  const { user, setCurrentPage, applications, setApplications, addNotification, isNewUser, jobs } = useApp();
  const [filterJob, setFilterJob] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  if (!user || user.type !== 'employer') {
    return null;
  }

  const myJobs = jobs.filter(job => job.postedBy === user.id || job.company === user.company);

  // Handle accepting applicant
  const handleAccept = (applicant) => {
    // Find and update the application by applicant's application ID
    const appToUpdate = applications.find(
      app => app.applicantId === applicant.applicantId && app.status === 'Pending'
    );
    
    if (appToUpdate) {
      setApplications(applications.map(app => 
        app.id === appToUpdate.id ? {...app, status: 'Accepted'} : app
      ));
      
      // Send notification to job seeker (user id '1' for demo)
      addNotification(
        '1',
        'status',
        'Application Accepted!',
        `Congratulations! Your application for ${applicant.jobTitle} at ${applicant.company} has been accepted.`
      );
      
      // Send notification to employer
      addNotification(
        user.id,
        'status',
        'Application Accepted',
        `You accepted ${applicant.name} for ${applicant.jobTitle}.`
      );
    }
  };

  // Handle rejecting applicant
  const handleReject = (applicant) => {
    // Find and update the application by applicant's application ID
    const appToUpdate = applications.find(
      app => app.applicantId === applicant.applicantId && app.status === 'Pending'
    );
    
    if (appToUpdate) {
      setApplications(applications.map(app => 
        app.id === appToUpdate.id ? {...app, status: 'Rejected'} : app
      ));
      
      // Send notification to job seeker (user id '1' for demo)
      addNotification(
        '1',
        'status',
        'Application Update',
        `Your application for ${applicant.jobTitle} has been reviewed.`
      );
      
      // Send notification to employer
      addNotification(
        user.id,
        'status',
        'Application Rejected',
        `You rejected ${applicant.name} for ${applicant.jobTitle}.`
      );
    }
  };

  // Mock applicants data
  const applicants = [
    {
      id: 1,
      applicantId: 'applicant1',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+63 912 345 6789',
      location: 'Cebu City, Philippines',
      jobId: myJobs[0]?.id || '1',
      jobTitle: myJobs[0]?.title || 'Front Desk Officer',
      company: myJobs[0]?.company || 'Metro Hotel Manila',
      appliedDate: '2025-11-24',
      status: 'Pending',
      skills: ['Communication', 'Customer Service', 'IT Literacy'],
      experience: '2 years',
      education: 'Bachelor of Science in Business Administration'
    },
    {
      id: 2,
      applicantId: 'applicant2',
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@email.com',
      phone: '+63 923 456 7890',
      location: 'Mandaue City, Cebu, Philippines',
      jobId: myJobs[1]?.id || '2',
      jobTitle: myJobs[1]?.title || 'Data Entry Specialist',
      company: myJobs[1]?.company || 'BPO Solutions Inc',
      appliedDate: '2025-11-23',
      status: 'Pending',
      skills: ['IT Literacy', 'Workplace Etiquette'],
      experience: '1 year',
      education: 'Associate Degree in Information Technology'
    },
    {
      id: 3,
      applicantId: 'applicant3',
      name: 'Ana Reyes',
      email: 'ana.reyes@email.com',
      phone: '+63 934 567 8901',
      location: 'Talisay City, Cebu, Philippines',
      jobId: myJobs[2]?.id || '3',
      jobTitle: myJobs[2]?.title || 'Administrative Assistant',
      company: myJobs[2]?.company || 'Global Business Corp',
      appliedDate: '2025-11-23',
      status: 'Pending',
      skills: ['IT Literacy', 'Communication', 'Workplace Etiquette'],
      experience: '3 years',
      education: 'Bachelor of Arts in Communication'
    }
  ];

  const filtered = filterJob === 'all' 
    ? applicants 
    : applicants.filter(a => a.jobId === filterJob);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => setCurrentPage('employer-dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="mb-2">View Applicants</h1>
          <p className="text-gray-600">Review candidates who applied to your job postings</p>
        </div>

        {isNewUser ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No applicants yet</p>
              <p className="text-gray-500 text-sm mb-4">Post your first job to start receiving applications</p>
              <Button onClick={() => setCurrentPage('post-job')}>
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filter */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <label className="text-gray-600">Filter by Job:</label>
                  <Select value={filterJob} onValueChange={setFilterJob}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      {myJobs.map(job => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-gray-600 ml-auto">
                    {filtered.length} applicant{filtered.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Applicants */}
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applicants yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filtered.map((applicant) => (
                  <Card key={applicant.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1">{applicant.name}</h3>
                            <p className="text-gray-600 mb-3">Applied for: {applicant.jobTitle}</p>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{applicant.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{applicant.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{applicant.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {applicant.skills.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-3">Applied on {applicant.appliedDate}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm text-center">
                            {applicant.status}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => setSelectedApplicant(applicant)}>
                            View Full Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            Download Resume
                          </Button>
                          <Button size="sm" onClick={() => handleAccept(applicant)}>
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(applicant)}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Applicant Details Dialog */}
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedApplicant?.name}</DialogTitle>
              <DialogDescription>Review the details of the applicant</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2">Contact Information</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{selectedApplicant?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedApplicant?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedApplicant?.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2">Applied Position</h3>
                <p className="text-gray-600">{selectedApplicant?.jobTitle}</p>
              </div>

              <div>
                <h3 className="mb-2">Experience</h3>
                <p className="text-gray-600">{selectedApplicant?.experience}</p>
              </div>

              <div>
                <h3 className="mb-2">Education</h3>
                <p className="text-gray-600">{selectedApplicant?.education}</p>
              </div>

              <div>
                <h3 className="mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant?.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2">Resume</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <Button size="sm" variant="outline">
                    Download Resume
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedApplicant(null)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => {
                handleReject(selectedApplicant);
                setSelectedApplicant(null);
              }}>
                Reject Candidate
              </Button>
              <Button onClick={() => {
                handleAccept(selectedApplicant);
                setSelectedApplicant(null);
              }}>
                Accept Candidate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}