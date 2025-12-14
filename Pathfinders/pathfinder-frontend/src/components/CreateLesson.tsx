import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';

export function CreateLesson() {
  const { user, setCurrentPage, employerLessons, setEmployerLessons, selectedLesson, addNotification } = useApp();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Communication',
    description: '',
    visibility: 'public',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  useEffect(() => {
    if (selectedLesson) {
      setFormData({
        title: selectedLesson.title,
        category: selectedLesson.category,
        description: selectedLesson.description,
        visibility: selectedLesson.visibility,
        questions: selectedLesson.questions || []
      });
    }
  }, [selectedLesson]);

  if (!user || user.type !== 'employer') {
    return null;
  }

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateQuestionField = (field, value) => {
    setCurrentQuestion({ ...currentQuestion, [field]: value });
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt.trim())) {
      setFormData({
        ...formData,
        questions: [...formData.questions, { ...currentQuestion }]
      });
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLesson = {
      id: selectedLesson?.id || String(employerLessons.length + 1),
      ...formData,
      createdBy: user.id,
      company: user.company || user.name,
      createdDate: selectedLesson?.createdDate || new Date().toISOString().split('T')[0],
      assignedTo: selectedLesson?.assignedTo || []
    };

    if (selectedLesson) {
      setEmployerLessons(employerLessons.map(l => l.id === selectedLesson.id ? newLesson : l));
      addNotification(
        user.id,
        'lesson',
        'Lesson Updated',
        `Your lesson "${formData.title}" has been updated successfully.`
      );
    } else {
      setEmployerLessons([...employerLessons, newLesson]);
      addNotification(
        user.id,
        'lesson',
        'Lesson Created',
        `Your lesson "${formData.title}" is now available to job seekers.`
      );
    }

    setSaved(true);
    setTimeout(() => setCurrentPage('manage-lessons'), 2000);
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="mb-2">Lesson {selectedLesson ? 'Updated' : 'Created'} Successfully!</h2>
            <p className="text-gray-600">Job seekers can now access this skill lesson.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentPage('manage-lessons')} 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>

        <Card>
          <CardContent className="p-8">
            <div className="mb-8">
              <h1 className="mb-2">{selectedLesson ? 'Edit' : 'Create New'} Skill Lesson</h1>
              <p className="text-gray-600">Design a custom skill assessment for job seekers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Advanced Customer Service Skills"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="IT Literacy">IT Literacy</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Workplace Etiquette">Workplace Etiquette</SelectItem>
                      <SelectItem value="Basic English">Basic English</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value) => updateField('visibility', value)}>
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - All job seekers can access</SelectItem>
                      <SelectItem value="assigned">Assigned Only - Send to specific applicants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what job seekers will learn from this lesson..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                />
              </div>

              {/* Questions Section */}
              <div className="border-t pt-6">
                <h3 className="mb-4">Assessment Questions</h3>

                {/* Existing Questions */}
                {formData.questions.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {formData.questions.map((q, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="mb-2"><strong>Q{index + 1}:</strong> {q.question}</p>
                              <div className="text-sm text-gray-600 space-y-1">
                                {q.options.map((opt, i) => (
                                  <div key={i} className={i === q.correctAnswer ? 'text-green-600' : ''}>
                                    {String.fromCharCode(65 + i)}. {opt} {i === q.correctAnswer && '✓'}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add New Question */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="mb-4">Add New Question</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Input
                          id="question"
                          placeholder="Enter your question"
                          value={currentQuestion.question}
                          onChange={(e) => updateQuestionField('question', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Answer Options</Label>
                        {currentQuestion.options.map((opt, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="flex items-center justify-center w-8 h-10 text-gray-600">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              value={opt}
                              onChange={(e) => updateOption(index, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="correctAnswer">Correct Answer</Label>
                        <Select 
                          value={String(currentQuestion.correctAnswer)} 
                          onValueChange={(value) => updateQuestionField('correctAnswer', parseInt(value))}
                        >
                          <SelectTrigger id="correctAnswer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Option A</SelectItem>
                            <SelectItem value="1">Option B</SelectItem>
                            <SelectItem value="2">Option C</SelectItem>
                            <SelectItem value="3">Option D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addQuestion}
                        className="w-full"
                        disabled={!currentQuestion.question || !currentQuestion.options.every(opt => opt.trim())}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentPage('manage-lessons')} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={formData.questions.length === 0}
                >
                  {selectedLesson ? 'Update' : 'Create'} Lesson
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
