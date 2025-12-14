import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { MessageCircle, Computer, Users, TrendingUp, ArrowLeft, BookOpen, Building2 } from 'lucide-react';

export function SkillBuildHome() {
  const { setCurrentPage, user, employerLessons, setSelectedModule } = useApp();

  const modules = [
    {
      id: 1,
      title: 'Communication Skills',
      description: 'Learn effective workplace communication and presentation skills',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'blue',
      progress: 60,
      lessons: 8,
      duration: '2 hours'
    },
    {
      id: 2,
      title: 'IT Literacy',
      description: 'Master essential computer and software skills for modern workplaces',
      icon: <Computer className="w-8 h-8" />,
      color: 'green',
      progress: 30,
      lessons: 10,
      duration: '3 hours'
    },
    {
      id: 3,
      title: 'Customer Service',
      description: 'Develop skills to provide excellent customer experiences',
      icon: <Users className="w-8 h-8" />,
      color: 'purple',
      progress: 0,
      lessons: 6,
      duration: '1.5 hours'
    },
    {
      id: 4,
      title: 'Workplace Etiquette',
      description: 'Learn professional behavior and workplace best practices',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'orange',
      progress: 0,
      lessons: 5,
      duration: '1 hour'
    }
  ];

  // Filter employer lessons - show public lessons or lessons assigned to current user
  const availableEmployerLessons = employerLessons.filter(lesson => 
    lesson.visibility === 'public' || 
    (user && lesson.assignedTo?.includes(user.id))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {user && (
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('jobseeker-dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}

        <div className="mb-8">
          <h1 className="mb-2">SkillBuild</h1>
          <p className="text-gray-600">
            Enhance your skills and increase your employability with our interactive modules
          </p>
        </div>

        {/* Standard Modules */}
        <h2 className="mb-4">Core Skill Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 bg-${module.color}-100 rounded-lg flex items-center justify-center mb-4 text-${module.color}-600`}>
                  {module.icon}
                </div>
                <h3 className="mb-2">{module.title}</h3>
                <p className="text-gray-600">{module.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{module.lessons} lessons</span>
                    <span>{module.duration}</span>
                  </div>
                  {module.progress > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className={`text-${module.color}-600`}>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedModule(module);
                    setCurrentPage('skill-module');
                  }}
                >
                  {module.progress > 0 ? 'Continue Learning' : 'Start Module'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Employer-Created Lessons */}
        {availableEmployerLessons.length > 0 && (
          <>
            <h2 className="mb-4">Employer-Created Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEmployerLessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Employer
                      </span>
                    </div>
                    <h3 className="mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.company}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lesson.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{lesson.questions?.length || 0} Questions</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {lesson.category}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setSelectedModule(lesson);
                        setCurrentPage('assessment');
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Lesson
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
