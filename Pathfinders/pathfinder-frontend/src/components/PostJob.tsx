import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Check } from 'lucide-react';

export function PostJob() {
  const { user, setCurrentPage, jobs, setJobs, addNotification } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [pendingJobData, setPendingJobData] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    skills: ''
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setPendingJobData(formData);
      setCurrentPage('login');
      return;
    }

    // TODO: Replace with actual API call to PHP backend
    const newJob = {
      id: String(Date.now()),
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      postedDate: new Date().toISOString().split('T')[0],
      postedBy: user.id,
      status: 'open'
    };

    setJobs([...jobs, newJob]);
    
    if (addNotification) {
      addNotification(
        user.id,
        'job',
        'Job Posted Successfully',
        `Your job posting "${formData.title}" is now live.`
      );
    }

    setSubmitted(true);
    setTimeout(() => {
      setCurrentPage('employer-dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="mb-2">Job Posted Successfully!</h2>
            <p className="text-gray-600">Your job posting is now live and visible to job seekers.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {user && (
          <Button 
            variant="ghost" 
            onClick={() => setCurrentPage('employer-dashboard')} 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}

        <Card>
          <CardContent className="p-8">
            <div className="mb-8">
              <h1 className="mb-2">Post a New Job</h1>
              <p className="text-gray-600">Fill in the details to create a job posting</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Front Desk Officer"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Philippines"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="₱15,000 - ₱20,000/month"
                    value={formData.salary}
                    onChange={(e) => updateField('salary', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the qualifications needed..."
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => updateField('requirements', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="Communication, Customer Service, IT Literacy"
                  value={formData.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                {user && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentPage('employer-dashboard')} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  {user ? 'Post Job' : 'Continue to Login'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
