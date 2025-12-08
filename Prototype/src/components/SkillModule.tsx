import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle2, Circle, PlayCircle, BookOpen, FileText, Video, MessageCircle, ArrowLeft } from 'lucide-react';

const lessonContent = [
  {
    id: 1,
    title: 'Introduction to Effective Communication',
    description: 'Learn the fundamentals of clear and professional communication',
    duration: '15 min',
    type: 'video',
    completed: true
  },
  {
    id: 2,
    title: 'Active Listening Skills',
    description: 'Master the art of listening and understanding in conversations',
    duration: '20 min',
    type: 'reading',
    completed: true
  },
  {
    id: 3,
    title: 'Written Communication Best Practices',
    description: 'Write clear, professional emails and documents',
    duration: '25 min',
    type: 'reading',
    completed: true
  },
  {
    id: 4,
    title: 'Verbal Communication in the Workplace',
    description: 'Speak confidently and effectively in professional settings',
    duration: '18 min',
    type: 'video',
    completed: true
  },
  {
    id: 5,
    title: 'Non-Verbal Communication Cues',
    description: 'Understand body language and non-verbal signals',
    duration: '12 min',
    type: 'reading',
    completed: true
  },
  {
    id: 6,
    title: 'Presentation Skills',
    description: 'Deliver engaging and impactful presentations',
    duration: '30 min',
    type: 'video',
    completed: true
  },
  {
    id: 7,
    title: 'Handling Difficult Conversations',
    description: 'Navigate challenging workplace discussions with confidence',
    duration: '22 min',
    type: 'reading',
    completed: false
  },
  {
    id: 8,
    title: 'Communication in Remote Work',
    description: 'Effective communication strategies for virtual teams',
    duration: '16 min',
    type: 'video',
    completed: false
  }
];

export function SkillModule() {
  const { setCurrentPage } = useApp();

  const completedLessons = lessonContent.filter(lesson => lesson.completed).length;
  const totalLessons = lessonContent.length;
  const progress = Math.round((completedLessons / totalLessons) * 100);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setCurrentPage('skillbuild')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to SkillBuild
      </Button>

      {/* Module Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="mb-2">Communication Skills</h1>
            <p className="text-gray-600">
              Master effective communication techniques for professional success
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">
                {completedLessons} of {totalLessons} lessons completed
              </span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Module Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About This Module</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Effective communication is one of the most valuable skills in any workplace. This module will help you develop both verbal and written communication abilities, teaching you how to express ideas clearly, listen actively, and build strong professional relationships.
          </p>
          <p className="text-gray-600">
            Through a series of interactive lessons and practical exercises, you'll learn:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>How to communicate clearly and professionally in any situation</li>
            <li>Active listening techniques to better understand others</li>
            <li>Writing skills for emails, reports, and documentation</li>
            <li>Presentation and public speaking fundamentals</li>
            <li>Strategies for handling difficult conversations</li>
          </ul>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <div className="mb-8">
        <h2 className="mb-6">Lesson Content</h2>
        <div className="space-y-4">
          {lessonContent.map((lesson, index) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {lesson.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1">
                          Lesson {index + 1}: {lesson.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{lesson.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(lesson.type)}
                        <span className="capitalize">{lesson.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant={lesson.completed ? "outline" : "default"}
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {lesson.completed ? (
                      <>Review</>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Assessment Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle>Ready to Test Your Knowledge?</CardTitle>
          <CardDescription>
            Complete the assessment to earn your Communication Skills certificate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You've completed {completedLessons} out of {totalLessons} lessons. 
            {completedLessons === totalLessons 
              ? " Great job! You're ready to take the assessment." 
              : " Complete all lessons to unlock the assessment."}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentPage('assessment')}
              disabled={completedLessons < totalLessons}
            >
              <FileText className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
            {completedLessons < totalLessons && (
              <p className="text-sm text-gray-600 flex items-center">
                Complete {totalLessons - completedLessons} more lesson{totalLessons - completedLessons !== 1 ? 's' : ''} to unlock
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
