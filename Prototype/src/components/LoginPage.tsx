import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Briefcase } from 'lucide-react';

export function LoginPage() {
  const { setCurrentPage, setUser } = useApp();
  const [loginType, setLoginType] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app would validate credentials
    const mockUser = {
      id: '1',
      name: loginType === 'jobseeker' ? 'John Doe' : 'Tech Corp',
      email: email,
      type: loginType,
      skills: loginType === 'jobseeker' ? ['Communication', 'IT Literacy'] : undefined,
      company: loginType === 'employer' ? 'TechCorp Solutions' : undefined
    };

    setUser(mockUser);
    setCurrentPage(loginType === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Welcome to PathFinder</CardTitle>
          <CardDescription>Login to continue your journey</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Login Type Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setLoginType('jobseeker')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                loginType === 'jobseeker'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login as Job Seeker
            </button>
            <button
              onClick={() => setLoginType('employer')}
              className={`flex-1 py-2 rounded-md transition-colors ${
                loginType === 'employer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login as Employer
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <div className="text-center text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentPage('register')}
              className="text-blue-600 hover:underline"
            >
              Register here
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
