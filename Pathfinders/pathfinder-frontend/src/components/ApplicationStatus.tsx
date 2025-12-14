import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Briefcase, Clock, CheckCircle, XCircle, ArrowLeft, MapPin, DollarSign, Calendar } from 'lucide-react';

export function ApplicationStatus() {
  const { user, setCurrentPage, applications, setApplications, addNotification, isNewUser } = useApp();
  const [selectedApp, setSelectedApp] = useState(null);

  // Find job details for selected application
  const getJobDetails = (app) => {
    const job = jobs.find(j => j.id === app.jobId);
    return job || {
      location: 'N/A',
      salary: 'N/A'
    };
  };

  const handleWithdraw = (app) => {
    setApplications(applications.filter(a => a.id !== app.id));
    
    if (user && addNotification) {
      addNotification(
        user.id,
        'status',
        'Application Withdrawn',
        `You withdrew your application for ${app.jobTitle} at ${app.company}.`
      );
    }
    
    setSelectedApp(null);
  };

  const getStatusColor = (status) => {
    if (status === 'Pending') return 'text-orange-600 bg-orange-50';
    if (status === 'Reviewed') return 'text-blue-600 bg-blue-50';
    if (status === 'Accepted') return 'text-green-600 bg-green-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status) => {
    if (status === 'Pending') return <Clock className="w-4 h-4" />;
    if (status === 'Reviewed') return <Clock className="w-4 h-4" />;
    if (status === 'Accepted') return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => setCurrentPage('jobseeker-dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="mb-2">My Applications</h1>
          <p className="text-gray-600">
            Track the status of your job applications ({isNewUser ? 0 : applications.length} total)
          </p>
        </div>

        {(isNewUser || applications.length === 0) ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No applications yet</p>
              <p className="text-gray-500 text-sm mb-4">Start applying to jobs to see them here</p>
              <Button onClick={() => setCurrentPage('job-listings')}>
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1">{app.jobTitle}</h3>
                        <p className="text-gray-600 mb-3">{app.company}</p>
                        <p className="text-sm text-gray-500">Applied on {app.appliedDate}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedApp && (
          <Dialog open={selectedApp !== null} onOpenChange={setSelectedApp}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  View the details of your application for {selectedApp.jobTitle} at {selectedApp.company}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="mb-1">Job Title</h3>
                    <p className="text-gray-600">{selectedApp.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="mb-1">Location</h3>
                    <p className="text-gray-600">{getJobDetails(selectedApp).location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="mb-1">Salary</h3>
                    <p className="text-gray-600">{getJobDetails(selectedApp).salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="mb-1">Applied Date</h3>
                    <p className="text-gray-600">{selectedApp.appliedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="mb-1">Status</h3>
                    <p className="text-gray-600">{selectedApp.status}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button size="sm" variant="outline" onClick={() => setSelectedApp(null)}>
                  Close
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleWithdraw(selectedApp)}>
                  Withdraw Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}