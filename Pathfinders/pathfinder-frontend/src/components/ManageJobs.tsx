import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Briefcase, MapPin, DollarSign, Edit, Trash2, ArrowLeft } from 'lucide-react';

export function ManageJobs() {
  const { user, setCurrentPage, jobs, setJobs, setSelectedJob, isNewUser } = useApp();
  const [editingJob, setEditingJob] = useState(null);
  const [editData, setEditData] = useState(null);

  if (!user || user.type !== 'employer') {
    return null;
  }

  const myJobs = jobs.filter(job => job.postedBy === user.id || job.company === user.company);

  const handleDelete = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const toggleStatus = (jobId) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {...job, status: job.status === 'open' ? 'closed' : 'open'};
      }
      return job;
    }));
  };

  const handleEdit = (jobId) => {
    const job = jobs.find(job => job.id === jobId);
    setEditingJob(jobId);
    setEditData({
      title: job.title,
      location: job.location,
      salary: job.salary,
      skills: job.skills,
      description: job.description,
      status: job.status
    });
  };

  const handleSaveEdit = () => {
    setJobs(jobs.map(job => {
      if (job.id === editingJob) {
        return {...job, ...editData};
      }
      return job;
    }));
    setEditingJob(null);
    setEditData(null);
    addNotification({ type: 'success', message: 'Job updated successfully' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => setCurrentPage('employer-dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="mb-2">Manage Job Postings</h1>
          <p className="text-gray-600">View and edit your posted jobs ({myJobs.length} total)</p>
        </div>

        {myJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No job postings yet</p>
              <p className="text-gray-500 text-sm mb-4">Create your first job posting to find great candidates</p>
              <Button onClick={() => setCurrentPage('post-job')}>
                Post a Job
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3>{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            job.status === 'open' 
                              ? 'bg-green-50 text-green-600' 
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.skills.map((skill) => (
                              <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                          Posted on {new Date(job.postedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" onClick={() => setCurrentPage('view-applicants')}>
                        View Applicants
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(job.id)}>
                        {job.status === 'open' ? 'Close' : 'Reopen'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(job.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {editingJob && (
          <Dialog open={true} onOpenChange={() => setEditingJob(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Job</DialogTitle>
                <DialogDescription>
                  Make changes to your job posting.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={editData.salary}
                    onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    value={editData.skills.join(', ')}
                    onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(',').map(skill => skill.trim()) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editData.status}
                    onValueChange={(value) => setEditData({ ...editData, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue>{editData.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingJob(null)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveEdit}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}