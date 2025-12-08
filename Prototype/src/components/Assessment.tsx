import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { CheckCircle2, XCircle, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'What is the most important aspect of active listening?',
    options: [
      'Waiting for your turn to speak',
      'Focusing fully on the speaker and understanding their message',
      'Thinking about your response while the other person talks',
      'Interrupting to ask questions'
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: 'Which of the following is an example of professional written communication?',
    options: [
      'Using all caps to emphasize important points',
      'Including emojis to express emotions',
      'Using clear, concise language with proper grammar',
      'Writing in casual slang'
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: 'What percentage of communication is non-verbal according to research?',
    options: [
      'About 25%',
      'About 50%',
      'About 70%',
      'About 90%'
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: 'When giving a presentation, what should you do to engage your audience?',
    options: [
      'Read directly from your slides',
      'Speak in a monotone voice',
      'Make eye contact and use varied tone',
      'Stand completely still'
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: 'How should you handle a difficult conversation with a colleague?',
    options: [
      'Avoid the conversation entirely',
      'Use "I" statements and focus on the behavior, not the person',
      'Blame them for the problem',
      'Talk to other colleagues about it first'
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: 'What is the best practice for email communication in a professional setting?',
    options: [
      'Use a casual greeting like "Hey"',
      'Write long paragraphs without breaks',
      'Use a clear subject line and professional greeting',
      'Send emails late at night'
    ],
    correctAnswer: 2
  },
  {
    id: 7,
    question: 'In remote work communication, what is most important?',
    options: [
      'Being available 24/7',
      'Only using email for all communication',
      'Clear, timely communication using appropriate channels',
      'Avoiding video calls'
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    question: 'What does effective feedback in the workplace include?',
    options: [
      'Only pointing out mistakes',
      'Being vague to avoid confrontation',
      'Specific examples and constructive suggestions',
      'Comparing the person to others'
    ],
    correctAnswer: 2
  }
];

export function Assessment() {
  const { setCurrentPage } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const score = showResults ? calculateScore() : null;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Results View
  if (showResults && score) {
    const passed = score.percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className={`${passed ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              {passed ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-orange-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Congratulations!' : 'Assessment Complete'}
            </CardTitle>
            <CardDescription>
              {passed 
                ? 'You have successfully passed the Communication Skills assessment!' 
                : 'You need 70% to pass. Review the lessons and try again.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="mb-4">
                  <span className={`text-5xl ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                    {score.percentage}%
                  </span>
                </div>
                <p className="text-gray-600">
                  You answered {score.correct} out of {score.total} questions correctly
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="text-green-600">{score.correct}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Incorrect Answers:</span>
                  <span className="text-red-600">{score.total - score.correct}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pass Mark:</span>
                  <span className="text-gray-900">70%</span>
                </div>
              </div>
            </div>

            {/* Results Details */}
            {passed && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="mb-3">Skill Progress Updated!</h3>
                <p className="text-gray-600 mb-4">
                  Your Communication Skills progress has been updated. This achievement will be reflected in your profile and can help you match with relevant job opportunities.
                </p>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Communication Skills Module Completed</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              {!passed && (
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage('skill-module')}
                >
                  Review Lessons
                </Button>
              )}
              {!passed && (
                <Button onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}>
                  Retake Assessment
                </Button>
              )}
              {passed && (
                <Button onClick={() => setCurrentPage('skillbuild')}>
                  Continue Learning
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => setCurrentPage('jobseeker-dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz View
  const currentQ = questions[currentQuestion];
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage('skill-module')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module
        </Button>

        <h1 className="mb-2">Communication Skills Assessment</h1>
        <p className="text-gray-600">
          Answer all questions to complete the assessment. You need 70% to pass.
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1}</CardTitle>
          <CardDescription className="text-base mt-3">
            {currentQ.question}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={answers[currentQ.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(currentQ.id, parseInt(value))}
          >
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    answers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm transition-colors ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[questions[index].id] !== undefined
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Assessment
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {!allAnswered && currentQuestion === questions.length - 1 && (
        <p className="text-center text-sm text-orange-600 mt-4">
          Please answer all questions before submitting
        </p>
      )}
    </div>
  );
}
