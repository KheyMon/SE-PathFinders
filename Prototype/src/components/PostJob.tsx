import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle2, Briefcase, ArrowLeft } from 'lucide-react';

export function PostJob() {
  const { setCurrentPage, user, jobs, setJobs } = useApp();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    workSetup: 'Full-time',
    location: '',
    skills: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setCurrentPage('login');
      return;
    }

    // Create new job posting
    const newJob = {
      id: `job-${Date.now()}`,
      title: formData.title,
      company: user.company || user.name,
      location: formData.location,
      salary: formData.salary,
      type: formData.workSetup,
      description: formData.description,
      requirements: formData.requirements,
      skills: formData.skills.split(',').map(s => s.trim()),
      postedBy: user.id,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'open'
    };

    setJobs([...jobs, newJob]);
    setShowConfirmation(true);
  };

  // Confirmation View
  if (showConfirmation) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Job Posted Successfully!</CardTitle>
            <CardDescription>
              Your job posting is now live on PathFinder
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="mb-4">Job Details</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Job Title:</span>
                  <span className="text-gray-900">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-gray-900">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Work Setup:</span>
                  <span className="text-gray-900">{formData.workSetup}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salary Range:</span>
                  <span className="text-gray-900">{formData.salary}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="mb-3">What's Next?</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Your job posting is visible to all job seekers on PathFinder</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive notifications when candidates apply</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Review applications in the "View Applicants" section</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => {
                setShowConfirmation(false);
                setFormData({
                  title: '',
                  description: '',
                  requirements: '',
                  salary: '',
                  workSetup: 'Full-time',
                  location: '',
                  skills: ''
                });
              }}>
                Post Another Job
              </Button>
              <Button 
                variant="outline"
                onClick={() => setCurrentPage('employer-dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form View
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      {user && (
        <Button
          variant="ghost"
          onClick={() => setCurrentPage(user.type === 'employer' ? 'employer-dashboard' : 'landing')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="mb-1">Post a New Job</h1>
            <p className="text-gray-600">
              Fill in the details to create your job posting
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
          <CardDescription>
            Provide accurate details to attract the right candidates
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. Front Desk Officer"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                required
              />
              <p className="text-sm text-gray-500">
                Provide a clear description of the role and key responsibilities
              </p>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                placeholder="List required qualifications, experience, and skills..."
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                rows={4}
                required
              />
              <p className="text-sm text-gray-500">
                Specify education, experience, and any specific requirements
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills *</Label>
              <Input
                id="skills"
                type="text"
                placeholder="e.g. Communication, IT Literacy, Customer Service"
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Enter skills separated by commas
              </p>
            </div>

            {/* Salary and Work Setup Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range *</Label>
                <Input
                  id="salary"
                  type="text"
                  placeholder="e.g. ₱20,000 - ₱25,000"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  required
                />
              </div>

              {/* Work Setup */}
              <div className="space-y-2">
                <Label htmlFor="workSetup">Work Setup *</Label>
                <Select 
                  value={formData.workSetup} 
                  onValueChange={(value) => handleChange('workSetup', value)}
                >
                  <SelectTrigger id="workSetup">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g. Manila, Philippines"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Post Job
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setCurrentPage(user ? (user.type === 'employer' ? 'employer-dashboard' : 'landing') : 'landing')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
