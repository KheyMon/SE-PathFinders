import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Briefcase, LogOut } from 'lucide-react';
import { Notifications } from './Notifications';

export function Header() {
  const { setCurrentPage, user, setUser } = useApp();

  const goHome = () => {
    if (user) {
      setCurrentPage(user.type === 'employer' ? 'employer-dashboard' : 'jobseeker-dashboard');
    } else {
      setCurrentPage('landing');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600">PathFinders</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!user && (
              <>
                <button onClick={() => setCurrentPage('job-listings')} className="text-gray-700 hover:text-blue-600 transition-colors">
                  Browse Jobs
                </button>
                <button onClick={() => setCurrentPage('skillbuild')} className="text-gray-700 hover:text-blue-600 transition-colors">
                  SkillBuild
                </button>
                <button onClick={() => setCurrentPage('login')} className="text-gray-700 hover:text-blue-600 transition-colors">
                  Employer Portal
                </button>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Button variant="ghost" onClick={() => setCurrentPage('login')}>
                  Login
                </Button>
                <Button onClick={() => setCurrentPage('register')}>
                  Register
                </Button>
                <Button variant="outline" onClick={() => setCurrentPage('post-job')} className="hidden md:flex">
                  Post a Job
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Notifications />
                <span className="text-gray-700">
                  Welcome, <span>{user.name}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}