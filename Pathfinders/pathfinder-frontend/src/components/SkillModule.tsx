import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle2, Circle, PlayCircle, BookOpen, ArrowLeft } from 'lucide-react';

export function SkillModule() {
  const { setCurrentPage } = useApp();
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Introduction to Effective Communication', duration: '15 min', type: 'video', done: true },
    { id: 2, title: 'Active Listening Skills', duration: '20 min', type: 'reading', done: true },
    { id: 3, title: 'Written Communication Best Practices', duration: '25 min', type: 'reading', done: true },
    { id: 4, title: 'Verbal Communication in the Workplace', duration: '18 min', type: 'video', done: true },
    { id: 5, title: 'Non-Verbal Communication Cues', duration: '12 min', type: 'reading', done: true },
    { id: 6, title: 'Presentation Skills', duration: '30 min', type: 'video', done: true },
    { id: 7, title: 'Handling Difficult Conversations', duration: '22 min', type: 'reading', done: false },
    { id: 8, title: 'Communication in Remote Work', duration: '16 min', type: 'video', done: false }
  ]);
  const [viewingLesson, setViewingLesson] = useState(null);

  const handleStartLesson = (lesson) => {
    setViewingLesson(lesson);
  };

  const handleCompleteLesson = () => {
    if (viewingLesson) {
      setLessons(lessons.map(l => 
        l.id === viewingLesson.id ? {...l, done: true} : l
      ));
      setViewingLesson(null);
    }
  };

  const completed = lessons.filter(l => l.done).length;
  const progress = Math.round((completed / lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Button variant="ghost" onClick={() => setCurrentPage('skillbuild')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to SkillBuild
        </Button>

        <div className="mb-8">
          <h1 className="mb-2">Communication Skills Module</h1>
          <p className="text-gray-600">Master effective workplace communication</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 mb-1">Course Progress</p>
                <p className="text-blue-600">{completed} of {lessons.length} lessons completed</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600">{progress}%</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className={lesson.done ? 'bg-green-50 border-green-200' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div>
                    {lesson.done ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{lesson.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        {lesson.type === 'video' ? (
                          <PlayCircle className="w-4 h-4" />
                        ) : (
                          <BookOpen className="w-4 h-4" />
                        )}
                        {lesson.type}
                      </span>
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                  <Button variant={lesson.done ? 'outline' : 'default'} onClick={() => handleStartLesson(lesson)}>
                    {lesson.done ? 'Review' : 'Start Lesson'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assessment Button */}
        <div className="mt-8 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h3 className="mb-2">Ready to test your knowledge?</h3>
              <p className="text-gray-600 mb-4">
                Complete the assessment to earn your certificate
              </p>
              <Button size="lg" onClick={() => setCurrentPage('assessment')}>
                Take Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Dialog */}
        {viewingLesson && (
          <Dialog open={true} onOpenChange={() => setViewingLesson(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{viewingLesson.title}</DialogTitle>
                <DialogDescription>
                  {viewingLesson.type === 'video' ? 'Watch the video' : 'Read the material'} to complete this lesson.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {viewingLesson.type === 'video' ? (
                  <video controls className="w-full">
                    <source src={`https://example.com/videos/${viewingLesson.id}.mp4`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="p-4 bg-gray-100 rounded">
                    <p className="text-gray-600">Content for {viewingLesson.title}</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button size="lg" onClick={handleCompleteLesson}>
                  Mark as Complete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}