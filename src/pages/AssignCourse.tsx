import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { 
  Users, BookOpen, Brain, ArrowLeft, Search, 
  Plus, CheckCircle, Clock, User, Target 
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Learner {
  id: number;
  name: string;
  email: string;
  totalCourses: number;
  completedCourses: number;
  avgProgress: number;
  enrolledCourses: EnrolledCourse[];
}

interface EnrolledCourse {
  id: number;
  title: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  score?: number;
  enrolledDate: string;
}

interface AvailableCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

const AssignCourse = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetHours: '',
    timeframe: 'weekly' as const,
    period: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is course manager
    const userData = localStorage.getItem('skillforge_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType !== 'admin' || parsed.adminRole !== 'course-manager') {
        navigate('/admin');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    // Load dummy data
    loadLearners();
    loadAvailableCourses();
  }, [navigate]);

  const loadLearners = () => {
    const dummyLearners: Learner[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        totalCourses: 3,
        completedCourses: 1,
        avgProgress: 67,
        enrolledCourses: [
          { id: 1, title: 'React Fundamentals', progress: 85, status: 'active', score: 92, enrolledDate: '2024-01-15' },
          { id: 2, title: 'Python for Data Science', progress: 100, status: 'completed', score: 88, enrolledDate: '2024-01-10' },
          { id: 3, title: 'UI/UX Design Principles', progress: 15, status: 'active', enrolledDate: '2024-02-01' }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        totalCourses: 2,
        completedCourses: 2,
        avgProgress: 100,
        enrolledCourses: [
          { id: 4, title: 'JavaScript Mastery', progress: 100, status: 'completed', score: 95, enrolledDate: '2024-01-05' },
          { id: 5, title: 'Advanced CSS', progress: 100, status: 'completed', score: 90, enrolledDate: '2024-01-20' }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        totalCourses: 1,
        completedCourses: 0,
        avgProgress: 45,
        enrolledCourses: [
          { id: 6, title: 'Node.js Backend Development', progress: 45, status: 'active', enrolledDate: '2024-02-10' }
        ]
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        totalCourses: 4,
        completedCourses: 2,
        avgProgress: 72,
        enrolledCourses: [
          { id: 7, title: 'Database Design', progress: 100, status: 'completed', score: 87, enrolledDate: '2024-01-01' },
          { id: 8, title: 'API Development', progress: 80, status: 'active', enrolledDate: '2024-01-25' },
          { id: 9, title: 'DevOps Fundamentals', progress: 60, status: 'active', enrolledDate: '2024-02-05' },
          { id: 10, title: 'Cloud Computing', progress: 100, status: 'completed', score: 93, enrolledDate: '2024-01-12' }
        ]
      }
    ];
    setLearners(dummyLearners);
  };

  const loadAvailableCourses = () => {
    const dummyCourses: AvailableCourse[] = [
      { id: 11, title: 'Machine Learning Basics', description: 'Introduction to ML concepts and algorithms', duration: '8 weeks', difficulty: 'Intermediate', category: 'Data Science' },
      { id: 12, title: 'Docker Containerization', description: 'Learn containerization with Docker', duration: '4 weeks', difficulty: 'Intermediate', category: 'DevOps' },
      { id: 13, title: 'React Native Mobile Development', description: 'Build mobile apps with React Native', duration: '10 weeks', difficulty: 'Advanced', category: 'Mobile Development' },
      { id: 14, title: 'Cybersecurity Fundamentals', description: 'Essential cybersecurity concepts', duration: '6 weeks', difficulty: 'Beginner', category: 'Security' },
      { id: 15, title: 'Advanced Python Programming', description: 'Deep dive into Python programming', duration: '12 weeks', difficulty: 'Advanced', category: 'Programming' }
    ];
    setAvailableCourses(dummyCourses);
  };

  const filteredLearners = learners.filter(learner =>
    learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    learner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignCourse = (courseId: number) => {
    if (!selectedLearner) return;

    const course = availableCourses.find(c => c.id === courseId);
    if (!course) return;

    // Add course to learner's enrolled courses
    const newEnrolledCourse: EnrolledCourse = {
      id: courseId,
      title: course.title,
      progress: 0,
      status: 'active',
      enrolledDate: new Date().toISOString().split('T')[0]
    };

    const updatedLearners = learners.map(learner => {
      if (learner.id === selectedLearner.id) {
        return {
          ...learner,
          totalCourses: learner.totalCourses + 1,
          enrolledCourses: [...learner.enrolledCourses, newEnrolledCourse]
        };
      }
      return learner;
    });

    setLearners(updatedLearners);
    setSelectedLearner({
      ...selectedLearner,
      totalCourses: selectedLearner.totalCourses + 1,
      enrolledCourses: [...selectedLearner.enrolledCourses, newEnrolledCourse]
    });

    setIsAssignDialogOpen(false);
    toast({
      title: "Course Assigned Successfully",
      description: `${course.title} has been assigned to ${selectedLearner.name}`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAvailableCoursesForLearner = () => {
    if (!selectedLearner) return availableCourses;
    
    const enrolledCourseIds = selectedLearner.enrolledCourses.map(course => course.id);
    return availableCourses.filter(course => !enrolledCourseIds.includes(course.id));
  };

  const handleSetLearningGoal = () => {
    if (!selectedLearner || !newGoal.title || !newGoal.targetHours || !newGoal.period) return;

    const goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetHours: parseInt(newGoal.targetHours),
      completedHours: 0,
      timeframe: newGoal.timeframe,
      period: newGoal.period,
      type: 'admin' as const,
      assignedBy: 'Course Manager - John Smith',
      status: 'active' as const,
      learnerId: selectedLearner.id
    };

    // Save to localStorage (in real app, this would be an API call)
    const existingGoals = JSON.parse(localStorage.getItem('skillforge_learning_goals') || '[]');
    const updatedGoals = [...existingGoals, goal];
    localStorage.setItem('skillforge_learning_goals', JSON.stringify(updatedGoals));

    setNewGoal({ title: '', description: '', targetHours: '', timeframe: 'weekly', period: '' });
    setShowGoalDialog(false);
    
    // Show success message
    alert(`Learning goal "${goal.title}" has been set for ${selectedLearner.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Assign Courses</h1>
                <p className="text-sm text-gray-500">Manage learner course assignments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learners List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Learners
                </CardTitle>
                <CardDescription>Select a learner to manage their course assignments</CardDescription>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search learners..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredLearners.map((learner) => (
                    <div
                      key={learner.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedLearner?.id === learner.id 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLearner(learner)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{learner.name}</h3>
                            <p className="text-sm text-gray-500">{learner.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{learner.totalCourses} courses</p>
                          <p className="text-sm text-gray-500">{learner.completedCourses} completed</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learner Details */}
          <div>
            {selectedLearner ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        {selectedLearner.name}'s Courses
                      </CardTitle>
                      <CardDescription>{selectedLearner.email}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Assign Course
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Assign Course to {selectedLearner.name}</DialogTitle>
                            <DialogDescription>
                              Select a course to assign to this learner
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 max-h-96 overflow-y-auto">
                            {getAvailableCoursesForLearner().map((course) => (
                              <div key={course.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="font-medium">{course.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <Badge variant="outline">{course.difficulty}</Badge>
                                      <span className="text-sm text-gray-500">{course.duration}</span>
                                      <span className="text-sm text-gray-500">{course.category}</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAssignCourse(course.id)}
                                    className="ml-4"
                                  >
                                    Assign
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Target className="h-4 w-4 mr-2" />
                            Set Learning Goal
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Set Learning Goal for {selectedLearner.name}</DialogTitle>
                            <DialogDescription>Create a learning target for this learner</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="goalTitle">Goal Title</Label>
                              <Input
                                id="goalTitle"
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                                placeholder="e.g., Complete React Course"
                              />
                            </div>
                            <div>
                              <Label htmlFor="goalDescription">Description</Label>
                              <Textarea
                                id="goalDescription"
                                value={newGoal.description}
                                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                                placeholder="Optional description of the learning goal"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="goalHours">Target Hours</Label>
                                <Input
                                  id="goalHours"
                                  type="number"
                                  value={newGoal.targetHours}
                                  onChange={(e) => setNewGoal({...newGoal, targetHours: e.target.value})}
                                  placeholder="15"
                                />
                              </div>
                              <div>
                                <Label htmlFor="goalTimeframe">Timeframe</Label>
                                <Select value={newGoal.timeframe} onValueChange={(value: any) => setNewGoal({...newGoal, timeframe: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="goalPeriod">Period</Label>
                              <Input
                                id="goalPeriod"
                                value={newGoal.period}
                                onChange={(e) => setNewGoal({...newGoal, period: e.target.value})}
                                placeholder="e.g., 2024-W25, 2024-06, 2024-Q2"
                              />
                            </div>
                            <Button onClick={handleSetLearningGoal} className="w-full">
                              Set Learning Goal
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedLearner.totalCourses}</p>
                        <p className="text-sm text-gray-600">Total Courses</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedLearner.completedCourses}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{selectedLearner.avgProgress}%</p>
                        <p className="text-sm text-gray-600">Avg Progress</p>
                      </div>
                    </div>

                    {/* Course List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedLearner.enrolledCourses.map((course) => (
                        <div key={course.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{course.title}</h3>
                              <p className="text-sm text-gray-500">Enrolled: {course.enrolledDate}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(course.status)}
                              <Badge variant={course.status === 'completed' ? 'default' : 'secondary'}>
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            {course.score && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Score: {course.score}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Learner</h3>
                    <p className="text-gray-500">Choose a learner from the list to view and manage their course assignments.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignCourse;
