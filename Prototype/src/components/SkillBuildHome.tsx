import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { BookOpen, CheckCircle2, TrendingUp, MessageCircle, Monitor, Globe, Users } from 'lucide-react';

const skillModules = [
  {
    id: 'communication',
    title: 'Communication Skills',
    description: 'Learn effective verbal and written communication techniques for the workplace',
    icon: MessageCircle,
    progress: 75,
    lessons: 8,
    completed: 6,
    color: 'blue'
  },
  {
    id: 'it-literacy',
    title: 'IT Literacy',
    description: 'Master essential computer skills and digital tools used in modern workplaces',
    icon: Monitor,
    progress: 50,
    lessons: 10,
    completed: 5,
    color: 'green'
  },
  {
    id: 'basic-english',
    title: 'Basic English',
    description: 'Improve your English language skills for professional settings',
    icon: Globe,
    progress: 30,
    lessons: 12,
    completed: 4,
    color: 'purple'
  },
  {
    id: 'workplace-etiquette',
    title: 'Workplace Etiquette',
    description: 'Understand professional behavior and workplace culture expectations',
    icon: Users,
    progress: 20,
    lessons: 6,
    completed: 1,
    color: 'orange'
  }
];

export function SkillBuildHome() {
  const { setCurrentPage, user } = useApp();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          border: 'border-green-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-600',
          border: 'border-purple-200'
        };
      case 'orange':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600',
          border: 'border-orange-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">SkillBuild Learning Center</h1>
        <p className="text-gray-600">
          Enhance your professional skills with our interactive modules and assessments
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Modules</p>
                <p className="text-blue-600">4</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Lessons Completed</p>
                <p className="text-green-600">
                  {skillModules.reduce((acc, module) => acc + module.completed, 0)} / {skillModules.reduce((acc, module) => acc + module.lessons, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Average Progress</p>
                <p className="text-purple-600">
                  {Math.round(skillModules.reduce((acc, module) => acc + module.progress, 0) / skillModules.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Modules */}
      <div className="mb-8">
        <h2 className="mb-6">Available Skill Modules</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillModules.map((module) => {
            const Icon = module.icon;
            const colors = getColorClasses(module.color);
            
            return (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="mb-2">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{module.completed} of {module.lessons} lessons completed</span>
                    <span className={colors.text}>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />

                  <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{module.completed} completed</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCurrentPage('skill-module')}
                  >
                    View Lessons
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setCurrentPage('skill-module')}
                  >
                    {module.progress > 0 ? 'Continue' : 'Start Module'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="py-8 text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="mb-2">Keep Building Your Skills!</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Complete skill modules to improve your profile and increase your chances of landing your dream job. 
            Employers value candidates who are committed to continuous learning.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setCurrentPage('skill-module')}>
              Start Learning
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentPage(user ? (user.type === 'employer' ? 'employer-dashboard' : 'jobseeker-dashboard') : 'landing')}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
