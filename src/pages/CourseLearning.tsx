
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, Clock, CheckCircle, Play, ChevronLeft, ChevronRight,
  Target, Calendar, Trophy, Settings, FileText, MessageCircle,
  AlertCircle, Star, Timer
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: number;
  completed: boolean;
  quiz?: Quiz;
}

interface Quiz {
  id: number;
  questions: Question[];
  passingScore: number;
  completed: boolean;
  score?: number;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessons: Lesson[];
}

interface LearningGoals {
  weeklyHours: number;
  dailyLessons: number;
  completionDate: string;
  studyDays: string[];
}

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [learningGoals, setLearningGoals] = useState<LearningGoals>({
    weeklyHours: 10,
    dailyLessons: 2,
    completionDate: '',
    studyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });

  // Mock course data
  const [course] = useState<Course>({
    id: parseInt(courseId || '1'),
    title: 'React Fundamentals',
    description: 'Master the basics of React development',
    totalLessons: 8,
    completedLessons: 3,
    progress: 37.5,
    lessons: [
      {
        id: 1,
        title: 'Introduction to React',
        content: 'React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Facebook and the community. React allows you to create reusable UI components and manage application state efficiently.',
        duration: 30,
        completed: true,
        quiz: {
          id: 1,
          questions: [
            {
              id: 1,
              question: 'What is React?',
              options: ['A database', 'A JavaScript library', 'A server', 'A CSS framework'],
              correctAnswer: 1
            },
            {
              id: 2,
              question: 'Who created React?',
              options: ['Google', 'Microsoft', 'Facebook', 'Twitter'],
              correctAnswer: 2
            }
          ],
          passingScore: 70,
          completed: true,
          score: 100
        }
      },
      {
        id: 2,
        title: 'Components and JSX',
        content: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. Components are the building blocks of React applications.',
        duration: 45,
        completed: true,
        quiz: {
          id: 2,
          questions: [
            {
              id: 1,
              question: 'What does JSX stand for?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extended', 'JavaScript Express'],
              correctAnswer: 0
            }
          ],
          passingScore: 70,
          completed: true,
          score: 100
        }
      },
      {
        id: 3,
        title: 'Props and State',
        content: 'Props are how you pass data to components, while state is how components manage their own data that can change over time.',
        duration: 50,
        completed: true,
        quiz: {
          id: 3,
          questions: [
            {
              id: 1,
              question: 'Props are used to:',
              options: ['Manage component state', 'Pass data to components', 'Style components', 'Handle events'],
              correctAnswer: 1
            }
          ],
          passingScore: 70,
          completed: true,
          score: 100
        }
      },
      {
        id: 4,
        title: 'Event Handling',
        content: 'Learn how to handle user interactions like clicks, form submissions, and other events in React components.',
        duration: 40,
        completed: false,
        quiz: {
          id: 4,
          questions: [
            {
              id: 1,
              question: 'How do you handle a click event in React?',
              options: ['onclick', 'onClick', 'onPress', 'handleClick'],
              correctAnswer: 1
            }
          ],
          passingScore: 70,
          completed: false
        }
      }
    ]
  });

  const currentLesson = course.lessons[currentLessonIndex];

  const handleLessonComplete = () => {
    if (currentLesson.quiz && !currentLesson.quiz.completed) {
      setShowQuiz(true);
    } else {
      goToNextLesson();
    }
  };

  const handleQuizSubmit = () => {
    const correctAnswers = quizAnswers.filter((answer, index) => 
      answer === currentLesson.quiz!.questions[index].correctAnswer
    ).length;
    
    const score = (correctAnswers / currentLesson.quiz!.questions.length) * 100;
    
    // Update quiz completion
    currentLesson.quiz!.completed = true;
    currentLesson.quiz!.score = score;
    
    setQuizCompleted(true);
    
    if (score >= currentLesson.quiz!.passingScore) {
      setTimeout(() => {
        setShowQuiz(false);
        setQuizCompleted(false);
        setQuizAnswers([]);
        goToNextLesson();
      }, 2000);
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleGoalUpdate = (field: keyof LearningGoals, value: any) => {
    setLearningGoals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/learner')}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-500">
                  Lesson {currentLessonIndex + 1} of {course.lessons.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {Math.round(course.progress)}% Complete
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {!showQuiz ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Clock className="h-4 w-4 mr-1" />
                        {currentLesson.duration} minutes
                        {currentLesson.completed && (
                          <Badge variant="secondary" className="ml-2 bg-green-50 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {currentLesson.content}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousLesson}
                      disabled={currentLessonIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={handleLessonComplete}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {currentLesson.quiz && !currentLesson.quiz.completed ? 'Take Quiz' : 'Next Lesson'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Lesson Quiz
                  </CardTitle>
                  <CardDescription>
                    Answer all questions to complete this lesson
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!quizCompleted ? (
                    <div className="space-y-6">
                      {currentLesson.quiz!.questions.map((question, questionIndex) => (
                        <div key={question.id} className="space-y-3">
                          <h3 className="font-medium text-lg">
                            {questionIndex + 1}. {question.question}
                          </h3>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${questionIndex}`}
                                  value={optionIndex}
                                  onChange={() => {
                                    const newAnswers = [...quizAnswers];
                                    newAnswers[questionIndex] = optionIndex;
                                    setQuizAnswers(newAnswers);
                                  }}
                                  className="text-indigo-600"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        onClick={handleQuizSubmit}
                        disabled={quizAnswers.length !== currentLesson.quiz!.questions.length}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        {currentLesson.quiz!.score! >= currentLesson.quiz!.passingScore ? (
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        ) : (
                          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Quiz {currentLesson.quiz!.score! >= currentLesson.quiz!.passingScore ? 'Passed!' : 'Failed'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Your score: {currentLesson.quiz!.score}%
                      </p>
                      {currentLesson.quiz!.score! < currentLesson.quiz!.passingScore && (
                        <Button 
                          onClick={() => {
                            setQuizCompleted(false);
                            setQuizAnswers([]);
                            currentLesson.quiz!.completed = false;
                          }}
                          variant="outline"
                        >
                          Retake Quiz
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{course.completedLessons}/{course.totalLessons}</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                  </div>
                  
                  <div className="space-y-2">
                    {course.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                          index === currentLessonIndex ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentLessonIndex(index)}
                      >
                        <div className="flex items-center">
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : index === currentLessonIndex ? (
                            <Play className="h-4 w-4 text-indigo-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300 mr-2" />
                          )}
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{lesson.duration}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Learning Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="goals" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="goals" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Weekly Hours Target</label>
                      <Input
                        type="number"
                        value={learningGoals.weeklyHours}
                        onChange={(e) => handleGoalUpdate('weeklyHours', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Daily Lessons Target</label>
                      <Input
                        type="number"
                        value={learningGoals.dailyLessons}
                        onChange={(e) => handleGoalUpdate('dailyLessons', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Completion Date</label>
                      <Input
                        type="date"
                        value={learningGoals.completionDate}
                        onChange={(e) => handleGoalUpdate('completionDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">This Week</span>
                      <span className="font-medium">4.5 / {learningGoals.weeklyHours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Today</span>
                      <span className="font-medium">1 / {learningGoals.dailyLessons} lessons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Streak</span>
                      <span className="font-medium">5 days</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
