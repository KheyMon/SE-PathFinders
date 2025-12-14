import React, { useState } from 'react';
// Assuming useApp provides setCurrentPage and setUser
import { useApp } from '../App'; 
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Briefcase } from 'lucide-react';
import api from '../services/api';

export function LoginPage() {
  // Destructuring application context methods
  const context = useApp() as { setCurrentPage: (page: string) => void; setUser: (user: any) => void } | null;
  
  if (!context) {
    return <div>Error: App context not available</div>;
  }
  
  const { setCurrentPage, setUser } = context;
  
  // State variables for form inputs and selected user type (for UI aesthetics only)
  const [type, setType] = useState('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // API call using credentials (email and password)
      const result = await api.login(email, password);

      if (result.user) {
        // Successful Login: Set user state globally
        setUser(result.user);
        
        // Navigate based on the user type returned from the PHP backend
        setCurrentPage(result.user.type === 'jobseeker' ? 'jobseeker-dashboard' : 'employer-dashboard');
      } else {
        // Failed Login: Display error message from the backend (e.g., Invalid credentials)
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      // Handle network or unhandled server errors
      alert('An error occurred during login. Check server status.');
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
          <h1 className="mb-2">Welcome to PathFinder</h1>
          <p className="text-gray-600">Login to continue your journey</p>
        </div>

        {/* Tabs - UI only, actual user type determined by backend */}
        <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setType('jobseeker')}
            className={`flex-1 py-3 rounded-md transition-all ${
              type === 'jobseeker'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Job Seeker Login
          </button>
          <button
            onClick={() => setType('employer')}
            className={`flex-1 py-3 rounded-md transition-all ${
              type === 'employer'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Employer Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-50"
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
              className="bg-gray-50"
            />
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white py-6">
            {type === 'jobseeker' ? 'Login as Job Seeker' : 'Login as Employer'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setCurrentPage('register')}
              className="text-blue-600 hover:underline"
            >
              Register here
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