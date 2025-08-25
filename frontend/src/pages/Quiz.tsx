import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import { QuizQuestion } from '../types';
import { motion } from 'framer-motion';

const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which of the following is a common sign of a phishing email?',
    options: [
      'Professional email formatting',
      'Urgent language asking you to verify account information',
      'Clear sender identification',
      'Proper spelling and grammar'
    ],
    correctAnswer: 1,
    explanation: 'Phishing emails often use urgent language to pressure users into acting quickly without thinking, such as "Your account will be suspended unless you verify immediately."',
    category: 'Email Security',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'What should you do if you receive a suspicious link in a text message?',
    options: [
      'Click it to see what it is',
      'Forward it to friends to warn them',
      'Delete the message without clicking',
      'Reply asking for more information'
    ],
    correctAnswer: 2,
    explanation: 'The safest approach is to delete suspicious messages without clicking any links. Clicking unknown links can lead to malware installation or credential theft.',
    category: 'Mobile Security',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'Which password is the strongest?',
    options: [
      'password123',
      'MyName2023!',
      'Tr0ub4dor&3',
      'correct horse battery staple'
    ],
    correctAnswer: 3,
    explanation: 'Passphrases with random words are both secure and memorable. They provide high entropy while being easier to remember than complex character combinations.',
    category: 'Password Security',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'What is social engineering in cybersecurity?',
    options: [
      'A type of computer programming',
      'Manipulating people to divulge confidential information',
      'A method of network configuration',
      'A form of data encryption'
    ],
    correctAnswer: 1,
    explanation: 'Social engineering exploits human psychology rather than technical vulnerabilities to gain unauthorized access to information or systems.',
    category: 'Social Engineering',
    difficulty: 'medium'
  },
  {
    id: '5',
    question: 'Which of these is NOT a recommended practice for safe browsing?',
    options: [
      'Checking URLs before clicking',
      'Using public Wi-Fi for banking',
      'Keeping browsers updated',
      'Using reputable antivirus software'
    ],
    correctAnswer: 1,
    explanation: 'Public Wi-Fi networks are unsecured and can be monitored by attackers. Sensitive activities like banking should only be done on trusted, encrypted networks.',
    category: 'Web Security',
    difficulty: 'hard'
  }
];

export const Quiz: React.FC = () => {
  const { state, dispatch } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const question = quizQuestions[currentQuestion];

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(null); // Auto-submit when time runs out
    }
  }, [timeLeft, isTimerActive, showExplanation]);

  // Start timer when component mounts
  useEffect(() => {
    setIsTimerActive(true);
    setTimeLeft(30);
  }, [currentQuestion]);

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setIsTimerActive(false);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
      // Award points
      dispatch({ type: 'ADD_POINTS', payload: 10 });
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setIsTimerActive(true);
    } else {
      setIsComplete(true);
      setIsTimerActive(false);
      
      // Award bonus points for completion
      dispatch({ type: 'ADD_POINTS', payload: 25 });
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsComplete(false);
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding! You\'re a digital security expert!';
    if (percentage >= 80) return 'Great job! You have solid security knowledge.';
    if (percentage >= 60) return 'Good effort! Keep learning to improve your security awareness.';
    return 'Keep practicing! Digital security skills take time to develop.';
  };

  if (isComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <div className="mb-6">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Quiz Complete!
                </h2>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Badge variant={getScoreColor(percentage) as any} size="md">
                    {score}/{quizQuestions.length} Correct
                  </Badge>
                  <Badge variant="info" size="md">
                    {percentage}% Score
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  {getScoreMessage(percentage)}
                </p>
                
                {percentage >= 80 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-yellow-800 font-medium">
                      Congratulations! You've earned 35 points and unlocked the "Security Savvy" badge!
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="secondary">
                  View More Quizzes
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mx-auto mb-4">
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Digital Security Quiz
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Badge variant="info">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
            <Badge variant="success">
              Score: {score}
            </Badge>
          </div>
        </motion.div>

        <Card>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-6">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`}>
              {timeLeft}s
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant="info" size="sm">{question.category}</Badge>
              <Badge 
                variant={question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'}
                size="sm"
              >
                {question.difficulty}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  showExplanation
                    ? index === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : selectedAnswer === index
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-gray-200 bg-gray-50 text-gray-600'
                    : selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation && index === question.correctAnswer && (
                    <span className="text-green-600 font-medium">✓ Correct</span>
                  )}
                  {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                    <span className="text-red-600 font-medium">✗ Wrong</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800 text-sm">{question.explanation}</p>
            </motion.div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="text-center">
              <Button onClick={handleNext} size="lg">
                {currentQuestion < quizQuestions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'Finish Quiz'
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};