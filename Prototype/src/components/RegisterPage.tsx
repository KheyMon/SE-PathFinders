import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Briefcase } from 'lucide-react';

export function RegisterPage() {
  const { setCurrentPage, setUser } = useApp();
  
  // Job Seeker form
  const [jsName, setJsName] = useState('');
  const [jsEmail, setJsEmail] = useState('');
  const [jsPassword, setJsPassword] = useState('');
  const [jsContact, setJsContact] = useState('');
  const [jsSkills, setJsSkills] = useState('');

  // Employer form
  const [empCompany, setEmpCompany] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empIndustry, setEmpIndustry] = useState('');
  const [empContact, setEmpContact] = useState('');

  const handleJobSeekerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockUser = {
      id: '1',
      name: jsName,
      email: jsEmail,
      type: 'jobseeker' as const,
      skills: jsSkills.split(',').map(s => s.trim())
    };

    setUser(mockUser);
    setCurrentPage('jobseeker-dashboard');
  };

  const handleEmployerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockUser = {
      id: '2',
      name: empCompany,
      email: empEmail,
      type: 'employer' as const,
      company: empCompany
    };

    setUser(mockUser);
    setCurrentPage('employer-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Create Your PathFinder Account</CardTitle>
          <CardDescription>Join thousands of job seekers and employers</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="jobseeker" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobseeker">Job Seeker Registration</TabsTrigger>
              <TabsTrigger value="employer">Employer Registration</TabsTrigger>
            </TabsList>

            {/* Job Seeker Registration */}
            <TabsContent value="jobseeker" className="mt-6">
              <form onSubmit={handleJobSeekerRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="js-name">Full Name</Label>
                  <Input
                    id="js-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={jsName}
                    onChange={(e) => setJsName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="js-email">Email</Label>
                  <Input
                    id="js-email"
                    type="email"
                    placeholder="Enter your email"
                    value={jsEmail}
                    onChange={(e) => setJsEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="js-password">Password</Label>
                  <Input
                    id="js-password"
                    type="password"
                    placeholder="Create a password"
                    value={jsPassword}
                    onChange={(e) => setJsPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="js-contact">Contact Number</Label>
                  <Input
                    id="js-contact"
                    type="tel"
                    placeholder="Enter your contact number"
                    value={jsContact}
                    onChange={(e) => setJsContact(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="js-skills">Skills (comma-separated)</Label>
                  <Input
                    id="js-skills"
                    type="text"
                    placeholder="e.g. Communication, IT Literacy, Customer Service"
                    value={jsSkills}
                    onChange={(e) => setJsSkills(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Enter your skills separated by commas
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Register as Job Seeker
                </Button>
              </form>
            </TabsContent>

            {/* Employer Registration */}
            <TabsContent value="employer" className="mt-6">
              <form onSubmit={handleEmployerRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emp-company">Company Name</Label>
                  <Input
                    id="emp-company"
                    type="text"
                    placeholder="Enter company name"
                    value={empCompany}
                    onChange={(e) => setEmpCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emp-email">Company Email</Label>
                  <Input
                    id="emp-email"
                    type="email"
                    placeholder="Enter company email"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emp-password">Password</Label>
                  <Input
                    id="emp-password"
                    type="password"
                    placeholder="Create a password"
                    value={empPassword}
                    onChange={(e) => setEmpPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emp-industry">Industry</Label>
                  <Input
                    id="emp-industry"
                    type="text"
                    placeholder="e.g. Technology, Retail, Healthcare"
                    value={empIndustry}
                    onChange={(e) => setEmpIndustry(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emp-contact">Contact Number</Label>
                  <Input
                    id="emp-contact"
                    type="tel"
                    placeholder="Enter contact number"
                    value={empContact}
                    onChange={(e) => setEmpContact(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Register as Employer
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <div className="text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </div>
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('landing')}
            className="w-full"
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
