
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Brain, Trophy, Clock, Play, CheckCircle, 
  Star, TrendingUp, MessageCircle, LogOut, Search,
  Filter, Award, Target, Users, BookMarked
} from 'lucide-react';

interface UserData {
  email: string;
  userType: string;
  name: string;
}

const LearnerDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('skillforge_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType !== 'learner') {
        navigate('/login');
      } else {
        setUser(parsed);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('skillforge_user');
    navigate('/login');
  };

  const handleCourseAction = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const assignedCourses = [
    { 
      id: 1, 
      title: 'React Fundamentals', 
      progress: 65, 
      totalLessons: 12, 
      completedLessons: 8,
      assignedBy: 'Admin Team',
      deadline: '2024-07-15',
      difficulty: 'Intermediate',
      category: 'Frontend Development'
    },
    { 
      id: 2, 
      title: 'Python for Data Science', 
      progress: 30, 
      totalLessons: 15, 
      completedLessons: 5,
      assignedBy: 'Data Team Lead',
      deadline: '2024-08-01',
      difficulty: 'Advanced',
      category: 'Data Science'
    },
  ];

  const availableCourses = [
    { 
      id: 3, 
      title: 'UI/UX Design Principles', 
      rating: 4.8, 
      students: 1234, 
      duration: '6 weeks',
      difficulty: 'Beginner',
      category: 'Design'
    },
    { 
      id: 4, 
      title: 'Machine Learning Basics', 
      rating: 4.6, 
      students: 892, 
      duration: '8 weeks',
      difficulty: 'Intermediate',
      category: 'AI/ML'
    },
    { 
      id: 5, 
      title: 'Advanced JavaScript', 
      rating: 4.9, 
      students: 2156, 
      duration: '4 weeks',
      difficulty: 'Advanced',
      category: 'Programming'
    },
  ];

  const recentAchievements = [
    { title: 'First Course Completed', date: '2024-06-01', icon: Trophy },
    { title: 'Weekly Streak', date: '2024-06-05', icon: Target },
    { title: 'Quiz Master', date: '2024-06-10', icon: Award },
  ];

  const aiAgentInteractions = [
    { agent: 'Tutor Agent', message: 'Great progress on React hooks! Try the advanced patterns next.', time: '2 hours ago' },
    { agent: 'Assessment Agent', message: 'Your quiz score improved by 15%. Keep it up!', time: '1 day ago' },
    { agent: 'Skill Tracker', message: 'You\'ve mastered 3 new skills this week.', time: '2 days ago' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Learning Journey</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Learner
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Courses Enrolled</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <BookOpen className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed</p>
                  <p className="text-3xl font-bold">2</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg. Score</p>
                  <p className="text-3xl font-bold">88%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Learning Streak</p>
                  <p className="text-3xl font-bold">12 days</p>
                </div>
                <Trophy className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assigned" className="space-y-6">
          <TabsList className="bg-white shadow-sm border">
            <TabsTrigger value="assigned">Assigned Courses</TabsTrigger>
            <TabsTrigger value="explore">Explore Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Assigned Courses</h2>
              <Badge variant="secondary">{assignedCourses.length} active assignments</Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assignedCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>Assigned by {course.assignedBy}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Due: {new Date(course.deadline).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <Progress value={course.progress} className="h-3" />
                        <p className="text-sm text-gray-500 mt-1">{course.progress}% complete</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Badge variant="secondary">{course.difficulty}</Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => handleCourseAction(course.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {course.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Explore Courses</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{course.students}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          {course.duration}
                        </span>
                        <Badge variant="secondary">{course.difficulty}</Badge>
                      </div>
                      
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {course.category}
                      </Badge>
                      
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <BookMarked className="h-4 w-4 mr-2" />
                        Enroll Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <achievement.icon className="h-8 w-8 text-yellow-600 mr-3" />
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-gray-500">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Weekly Study Time</span>
                      <span className="font-medium">12.5 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Quiz Average</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Skills Acquired</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Learning Streak</span>
                      <span className="font-medium">12 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Learning Assistant</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                6 agents active
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Recent AI Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAgentInteractions.map((interaction, index) => (
                      <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm text-indigo-600">
                            {interaction.agent}
                          </span>
                          <span className="text-xs text-gray-500">{interaction.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{interaction.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Available AI Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Tutor Agent', description: 'Personalized learning guidance', status: 'active' },
                      { name: 'Assessment Agent', description: 'Quiz and evaluation support', status: 'active' },
                      { name: 'Skill Tracker', description: 'Progress and skill mapping', status: 'active' },
                      { name: 'Roleplay Agent', description: 'Interactive practice scenarios', status: 'inactive' },
                    ].map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.description}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerDashboard;
