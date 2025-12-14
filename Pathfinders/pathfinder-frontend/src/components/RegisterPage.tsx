import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Briefcase } from 'lucide-react';
import api from '../services/api';

export function RegisterPage() {
  const { setCurrentPage, setUser } = useApp();
  const [type, setType] = useState('jobseeker');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
    skills: '',
    desiredPosition: '',
    company: '',
    industry: ''
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        user_type: type,
        company: type === 'employer' ? formData.company : null
      };

      const result = await api.register(payload);

      if (result.user) {
        setUser(result.user);
        setCurrentPage(result.user.type === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      alert('An error occurred during registration');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-8 h-8 text-white" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2">Create Your PathFinder Account</h1>
          <p className="text-gray-600">Join thousands of job seekers and employers</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setType('jobseeker')}
            className={`flex-1 py-3 rounded-md transition-all ${
              type === 'jobseeker'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Job Seeker Registration
          </button>
          <button
            onClick={() => setType('employer')}
            className={`flex-1 py-3 rounded-md transition-all ${
              type === 'employer'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Employer Registration
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {type === 'jobseeker' ? (
            <>
              {/* Job Seeker Fields */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  placeholder="Enter your contact number"
                  value={formData.contactNumber}
                  onChange={(e) => updateField('contactNumber', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desiredPosition">Desired Position</Label>
                <Input
                  id="desiredPosition"
                  placeholder="e.g. Software Engineer, Marketing Manager"
                  value={formData.desiredPosition}
                  onChange={(e) => updateField('desiredPosition', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g. Communication, IT Literacy, Customer Service"
                  value={formData.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  required
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">Enter your skills separated by commas</p>
              </div>
            </>
          ) : (
            <>
              {/* Employer Fields */}
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter company email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g. Technology, Retail, Healthcare"
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  placeholder="Enter contact number"
                  value={formData.contactNumber}
                  onChange={(e) => updateField('contactNumber', e.target.value)}
                  required
                  className="bg-gray-50"
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white py-6">
            {type === 'jobseeker' ? 'Register as Job Seeker' : 'Register as Employer'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
          <button
            onClick={() => setCurrentPage('landing')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}