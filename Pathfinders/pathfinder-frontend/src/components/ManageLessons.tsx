import React from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { ArrowLeft, Plus, BookOpen, Users, Edit, Trash2 } from 'lucide-react';

export function ManageLessons() {
  const { user, setCurrentPage, employerLessons, setEmployerLessons, setSelectedLesson } = useApp();

  if (!user || user.type !== 'employer') {
    return null;
  }

  const myLessons = employerLessons.filter(lesson => lesson.createdBy === user.id);

  const handleEdit = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentPage('create-lesson');
  };

  const handleDelete = (lessonId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setEmployerLessons(employerLessons.filter(l => l.id !== lessonId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentPage('employer-dashboard')} 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Manage Skill Lessons</h1>
            <p className="text-gray-600">Create and manage custom skill lessons for job seekers</p>
          </div>
          <Button onClick={() => {
            setSelectedLesson(null);
            setCurrentPage('create-lesson');
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Lesson
          </Button>
        </div>

        {myLessons.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">No Lessons Created Yet</h3>
              <p className="text-gray-600 mb-6">
                Create custom skill lessons to help job seekers develop the skills they need for your job positions
              </p>
              <Button onClick={() => {
                setSelectedLesson(null);
                setCurrentPage('create-lesson');
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Lesson
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      lesson.visibility === 'public' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {lesson.visibility === 'public' ? 'Public' : 'Assigned Only'}
                    </span>
                  </div>
                  <h3 className="mb-1">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm">{lesson.category}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{lesson.questions?.length || 0} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{lesson.assignedTo?.length || 0} Assigned</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(lesson)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(lesson.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
