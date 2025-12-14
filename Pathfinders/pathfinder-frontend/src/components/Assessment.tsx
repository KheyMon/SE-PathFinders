import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle, XCircle, ArrowLeft, Award } from 'lucide-react';

export function Assessment() {
  const { setCurrentPage } = useApp();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'What is the most important aspect of active listening?',
      options: [
        'Speaking loudly',
        'Paying full attention to the speaker',
        'Interrupting with questions',
        'Planning your response'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'Which of these is an example of non-verbal communication?',
      options: [
        'Email',
        'Phone call',
        'Body language',
        'Text message'
      ],
      correct: 2
    },
    {
      id: 3,
      question: 'What should you do when communicating with a difficult person?',
      options: [
        'Raise your voice',
        'Stay calm and professional',
        'Ignore them',
        'Argue back'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'Which is NOT a good practice for email communication?',
      options: [
        'Using a clear subject line',
        'Writing in all caps',
        'Proofreading before sending',
        'Being concise'
      ],
      correct: 1
    },
    {
      id: 5,
      question: 'What is the best way to start a presentation?',
      options: [
        'Apologizing for nervousness',
        'Reading from slides',
        'With a strong opening statement',
        'With a long introduction'
      ],
      correct: 2
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({...answers, [current]: answer});
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = () => {
    setFinished(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (finished) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className={passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
            <CardContent className="py-12 text-center">
              <div className={`w-20 h-20 ${passed ? 'bg-green-600' : 'bg-red-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {passed ? (
                  <Award className="w-10 h-10 text-white" />
                ) : (
                  <XCircle className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="mb-4">{passed ? 'Congratulations!' : 'Keep Learning'}</h1>
              <p className={`${passed ? 'text-green-900' : 'text-red-900'} mb-4 text-xl`}>
                Your Score: {score}%
              </p>
              <p className="text-gray-600 mb-8">
                {passed 
                  ? 'You have successfully completed the Communication Skills assessment!'
                  : 'You need 70% or higher to pass. Review the lessons and try again.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setCurrentPage('skill-module')}>
                  Back to Module
                </Button>
                {!passed && (
                  <Button onClick={() => {
                    setCurrent(0);
                    setAnswers({});
                    setFinished(false);
                  }}>
                    Try Again
                  </Button>
                )}
                {passed && (
                  <Button onClick={() => setCurrentPage('skillbuild')}>
                    Continue Learning
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Button variant="ghost" onClick={() => setCurrentPage('skill-module')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Module
        </Button>

        <div className="mb-8">
          <h1 className="mb-2">Communication Skills Assessment</h1>
          <p className="text-gray-600">Answer all questions to complete the assessment</p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="text-blue-600">Question {current + 1} of {questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[current] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={current === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === current ? 'bg-blue-600' : i in answers ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          {current < questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!(current in answers)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
