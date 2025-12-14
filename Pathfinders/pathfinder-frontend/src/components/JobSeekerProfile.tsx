import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { User, Mail, Phone, MapPin, ArrowLeft, Check, Upload, Trash2, FileText, X, Plus, GraduationCap, Briefcase, Target } from 'lucide-react';

export function JobSeekerProfile() {
  const context = useApp();
  const { user, setCurrentPage, hasResume, setHasResume } = context || { 
    user: null as any, 
    setCurrentPage: (page: string) => {}, 
    hasResume: false, 
    setHasResume: (value: boolean) => {} 
  };
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  // Profile data
  const [data, setData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+63 912 345 6789',
    location: 'Cebu City, Philippines',
    desiredPosition: 'Front Desk Officer / Customer Service',
    experience: '2 years',
    education: 'Bachelor of Science in Business Administration',
    about: 'Motivated job seeker with strong communication skills and a passion for customer service. Seeking opportunities to grow professionally and contribute to a dynamic team.',
    skills: user?.skills || ['Communication', 'Customer Service', 'IT Literacy']
  });

  const save = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadResume = () => {
    setHasResume(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteResume = () => {
    setHasResume(false);
    setShowDeleteDialog(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData({...data, skills: [...data.skills, newSkill.trim()]});
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string): void => {
    setData({...data, skills: data.skills.filter((s: string) => s !== skillToRemove)});
  };

  if (!user || user.type !== 'jobseeker') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setCurrentPage('jobseeker-dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-green-900">Changes saved successfully!</p>
              <p className="text-green-700 text-sm">Your profile has been updated.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and resume</p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="mb-1">{data.name}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Target className="w-4 h-4" />
                  <span>{data.desiredPosition}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{data.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        {editing && (
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-6">
              <h3 className="mb-4">Edit Profile Information</h3>
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={data.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={data.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input value={data.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input value={data.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, location: e.target.value})} />
                </div>
              </div>

              {/* Desired Position - More Prominent */}
              <div className="space-y-2 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Desired Position *
                </Label>
                <Input 
                  value={data.desiredPosition} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, desiredPosition: e.target.value})} 
                  placeholder="e.g., Customer Service Representative, Data Entry Specialist"
                  className="bg-white"
                />
                <p className="text-sm text-blue-700">What type of job are you looking for? This helps employers find you.</p>
              </div>

              <div className="space-y-2">
                <Label>About Me *</Label>
                <Textarea 
                  value={data.about} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData({...data, about: e.target.value})} 
                  rows={4} 
                  placeholder="Tell employers about yourself, your strengths, and what you're looking for..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input 
                    value={data.experience} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, experience: e.target.value})} 
                    placeholder="e.g., 2 years, Fresh Graduate"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Education</Label>
                  <Input 
                    value={data.education} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({...data, education: e.target.value})} 
                    placeholder="e.g., Bachelor's Degree, High School Graduate"
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-3">
                <Label>Skills *</Label>
                <div className="flex gap-2">
                  <Input 
                      value={newSkill}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill (e.g., Communication, MS Office)"
                    />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {data.skills.length === 0 ? (
                    <p className="text-gray-400 text-sm">No skills added yet</p>
                  ) : (
                    data.skills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center gap-2">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <p className="text-sm text-gray-500">Add skills that match the jobs you're interested in</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={save} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Mode */}
        {!editing && (
          <>
            {/* About */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="mb-3">About Me</h3>
                <p className="text-gray-600">{data.about}</p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="mb-4">Skills</h3>
                {data.skills.length === 0 ? (
                  <p className="text-gray-400">No skills added yet. Click "Edit Profile" to add skills.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <h3>Experience</h3>
                  </div>
                  <p className="text-gray-600">{data.experience}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3>Education</h3>
                  </div>
                  <p className="text-gray-600">{data.education}</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Resume */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4">Resume</h3>
            {hasResume ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-green-900 mb-1">Resume uploaded successfully!</p>
                      <p className="text-green-700 text-sm">resume.pdf</p>
                      <p className="text-green-600 text-xs mt-1">Uploaded on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={uploadResume}>
                      <Upload className="w-4 h-4 mr-2" />
                      Replace
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No resume uploaded yet</p>
                <p className="text-gray-500 text-sm mb-4">Upload your resume to apply for jobs</p>
                <Button onClick={uploadResume}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Resume?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your resume? This action cannot be undone. You will need to upload a new resume if you want to apply for jobs.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteResume}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Resume
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}