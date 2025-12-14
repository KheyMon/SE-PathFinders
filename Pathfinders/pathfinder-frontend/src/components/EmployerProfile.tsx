import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Building2, Mail, Phone, MapPin, Globe, ArrowLeft, Check } from 'lucide-react';

export function EmployerProfile() {
  const { user, setCurrentPage } = useApp();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [data, setData] = useState({
    company: user?.company || '',
    email: user?.email || '',
    phone: '+63 2 1234 5678',
    location: 'Cebu Business Park, Cebu City, Philippines',
    industry: 'Technology',
    website: 'www.techcorp.com',
    about: 'Leading technology company providing innovative solutions for businesses.',
    employees: '50-200'
  });

  const save = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user || user.type !== 'employer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => setCurrentPage('employer-dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <p className="text-green-900">Profile updated successfully!</p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="mb-2">Company Profile</h1>
          <p className="text-gray-600">Manage your company information</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="mb-1">{data.company}</h2>
                    <p className="text-gray-600">{data.industry}</p>
                  </div>
                  <Button onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-gray-600">
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
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{data.website}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {editing ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={data.company} onChange={(e) => setData({...data, company: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={data.industry} onChange={(e) => setData({...data, industry: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={data.location} onChange={(e) => setData({...data, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={data.website} onChange={(e) => setData({...data, website: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>About Company</Label>
                <Textarea value={data.about} onChange={(e) => setData({...data, about: e.target.value})} rows={4} />
              </div>
              <Button onClick={save} className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-3">About Company</h3>
              <p className="text-gray-600">{data.about}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}