import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Users, FileText, Calendar, CheckCircle2, XCircle, ArrowLeft, Mail, Phone } from 'lucide-react';

// Mock applicants data
const mockApplicants = [
  {
    id: 1,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '+63 912 345 6789',
    jobId: '1',
    jobTitle: 'Front Desk Officer',
    skills: ['Communication', 'Customer Service', 'IT Literacy'],
    appliedDate: '2025-11-24',
    resumeUrl: '#',
    status: 'pending',
    experience: '2 years in customer service',
    education: 'Bachelor of Arts in Communication'
  },
  {
    id: 2,
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 917 234 5678',
    jobId: '3',
    jobTitle: 'Data Entry Specialist',
    skills: ['IT Literacy', 'Workplace Etiquette'],
    appliedDate: '2025-11-23',
    resumeUrl: '#',
    status: 'pending',
    experience: '1 year data entry experience',
    education: 'Vocational Course in Computer Operations'
  },
  {
    id: 3,
    name: 'Ana Reyes',
    email: 'ana.reyes@email.com',
    phone: '+63 918 345 6789',
    jobId: '5',
    jobTitle: 'Administrative Assistant',
    skills: ['IT Literacy', 'Communication', 'Workplace Etiquette'],
    appliedDate: '2025-11-23',
    resumeUrl: '#',
    status: 'approved',
    experience: '3 years administrative experience',
    education: 'Bachelor of Science in Business Administration'
  },
  {
    id: 4,
    name: 'Carlos Garcia',
    email: 'carlos.garcia@email.com',
    phone: '+63 919 456 7890',
    jobId: '1',
    jobTitle: 'Front Desk Officer',
    skills: ['Communication', 'Customer Service'],
    appliedDate: '2025-11-22',
    resumeUrl: '#',
    status: 'pending',
    experience: '6 months front desk experience',
    education: 'College Level'
  },
  {
    id: 5,
    name: 'Elena Martinez',
    email: 'elena.martinez@email.com',
    phone: '+63 920 567 8901',
    jobId: '5',
    jobTitle: 'Administrative Assistant',
    skills: ['IT Literacy', 'Communication', 'Basic English'],
    appliedDate: '2025-11-21',
    resumeUrl: '#',
    status: 'rejected',
    experience: 'Fresh graduate',
    education: 'Bachelor of Arts in English'
  }
];

export function ViewApplicants() {
  const { setCurrentPage, jobs, user } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [applicants, setApplicants] = useState(mockApplicants);

  if (!user || user.type !== 'employer') {
    return null;
  }

  // Get employer's jobs
  const employerJobs = jobs.filter(job => job.postedBy === user.id || job.company === user.company);

  // Filter applicants
  const filteredApplicants = selectedJobId === 'all' 
    ? applicants 
    : applicants.filter(app => app.jobId === selectedJobId);

  const handleApprove = (applicantId: number) => {
    setApplicants(applicants.map(app => 
      app.id === applicantId ? { ...app, status: 'approved' } : app
    ));
    setSelectedApplicant(null);
  };

  const handleReject = (applicantId: number) => {
    setApplicants(applicants.map(app => 
      app.id === applicantId ? { ...app, status: 'rejected' } : app
    ));
    setSelectedApplicant(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <h1 className="mb-2">View Applicants</h1>
        <p className="text-gray-600">
          Review and manage applications for your job postings
        </p>
      </div>

      {/* Filter Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              Filter by Job:
            </label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {employerJobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 ml-auto">
              {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Applicants List */}
      {filteredApplicants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="mb-2">No Applicants Yet</h3>
            <p className="text-gray-600">
              Applications will appear here once candidates start applying to your jobs
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{applicant.name}</h3>
                        <Badge className={`${getStatusColor(applicant.status)} border-0 capitalize`}>
                          {applicant.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Applied for <span>{applicant.jobTitle}</span>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-gray-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{applicant.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Applied {new Date(applicant.appliedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
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

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Applicant Details Dialog */}
      {selectedApplicant && (
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <DialogTitle className="mb-2">{selectedApplicant.name}</DialogTitle>
                  <DialogDescription>
                    Application for {selectedApplicant.jobTitle}
                  </DialogDescription>
                </div>
                <Badge className={`${getStatusColor(selectedApplicant.status)} border-0 capitalize`}>
                  {selectedApplicant.status}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Contact Information */}
              <div>
                <h3 className="mb-3">Contact Information</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{selectedApplicant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedApplicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Applied on {new Date(selectedApplicant.appliedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="mb-2">Experience</h3>
                <p className="text-gray-600">{selectedApplicant.experience}</p>
              </div>

              {/* Education */}
              <div>
                <h3 className="mb-2">Education</h3>
                <p className="text-gray-600">{selectedApplicant.education}</p>
              </div>

              {/* Resume */}
              <div>
                <h3 className="mb-3">Resume</h3>
                <Button variant="outline" className="w-full md:w-auto">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>

              {/* Actions */}
              {selectedApplicant.status === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="mb-3">Take Action</h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(selectedApplicant.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedApplicant.id)}
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setSelectedApplicant(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
