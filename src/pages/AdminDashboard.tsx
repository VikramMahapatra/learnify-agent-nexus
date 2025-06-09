import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, BookOpen, Brain, TrendingUp, PlusCircle, 
  Settings, LogOut, Award, BarChart3, Clock, 
  CheckCircle, AlertCircle, Star 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ConfigureAgentsDialog from '@/components/ConfigureAgentsDialog';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

interface UserData {
  email: string;
  userType: string;
  adminRole: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
  originalName: string;
  description: string;
  active: boolean;
  isAdded: boolean;
  interactions?: number;
  efficiency?: number;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [systemAgents, setSystemAgents] = useState<Agent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('skillforge_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType !== 'admin') {
        navigate('/login');
      } else {
        setUser(parsed);
      }
    } else {
      navigate('/login');
    }

    // Load system agents
    loadSystemAgents();
  }, [navigate]);

  const loadSystemAgents = () => {
    const savedAgents = localStorage.getItem('skillforge_system_agents');
    if (savedAgents) {
      setSystemAgents(JSON.parse(savedAgents));
    }
  };

  const handleAgentsUpdate = (agents: Agent[]) => {
    setSystemAgents(agents);
  };

  const handleLogout = () => {
    localStorage.removeItem('skillforge_user');
    navigate('/login');
  };

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  const handleAssignCourse = () => {
    navigate('/assign-course');
  };

  const dummyCourses = [
    { id: 1, title: 'React Fundamentals', students: 45, progress: 78, status: 'active' },
    { id: 2, title: 'Python for Data Science', students: 32, progress: 65, status: 'active' },
    { id: 3, title: 'UI/UX Design Principles', students: 28, progress: 90, status: 'completed' },
  ];

  const dummyLearners = [
    { id: 1, name: 'John Doe', course: 'React Fundamentals', progress: 85, score: 92 },
    { id: 2, name: 'Jane Smith', course: 'Python for Data Science', progress: 60, score: 88 },
    { id: 3, name: 'Mike Johnson', course: 'UI/UX Design Principles', progress: 95, score: 95 },
  ];

  const isLearnerManager = user?.adminRole === 'Learner Manager';

  if (!user) return null;

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'content-creator':
        return 'Create learning paths, courses, and quizzes';
      case 'course-manager':
        return 'Assign courses and manage learner progress';
      case 'progress-tracker':
        return 'Track learner progress and publish results';
      default:
        return 'Admin user';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkillForge Admin</h1>
                <p className="text-sm text-gray-500">{getRoleDescription(user.adminRole)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {user.adminRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  <p className="text-blue-100">Total Learners</p>
                  <p className="text-3xl font-bold">1,234</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Courses</p>
                  <p className="text-3xl font-bold">56</p>
                </div>
                <BookOpen className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Completion Rate</p>
                  <p className="text-3xl font-bold">78%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Active Agents</p>
                  <p className="text-3xl font-bold">{systemAgents.filter(agent => agent.active).length}</p>
                </div>
                <Brain className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={isLearnerManager ? "analytics" : "overview"} className="space-y-6">
          <TabsList className="bg-white shadow-sm border">
            {!isLearnerManager && <TabsTrigger value="overview">Overview</TabsTrigger>}
            {!isLearnerManager && <TabsTrigger value="users">User Management</TabsTrigger>}
            {!isLearnerManager && <TabsTrigger value="courses">Course Management</TabsTrigger>}
            {!isLearnerManager && <TabsTrigger value="agents">AI Agents</TabsTrigger>}
            {isLearnerManager && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
            {isLearnerManager && <TabsTrigger value="overview">Overview</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dummyLearners.map((learner) => (
                      <div key={learner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{learner.name}</p>
                          <p className="text-sm text-gray-500">{learner.course}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{learner.progress}% complete</p>
                          <p className="text-sm text-gray-500">Score: {learner.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Agent Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAgents.slice(0, 4).map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-sm font-medium">{agent.name}</span>
                        </div>
                        <Badge variant={agent.active ? 'default' : 'secondary'}>
                          {agent.efficiency || 90}% efficient
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Course Management</h2>
              {user.adminRole === 'content-creator' && (
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleCreateCourse}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </div>
                    <CardDescription>{course.students} enrolled students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Users className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Learner Progress</h2>
              {user.adminRole === 'course-manager' && (
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAssignCourse}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assign Courses
                </Button>
              )}
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Learner</th>
                        <th className="text-left p-4 font-medium">Course</th>
                        <th className="text-left p-4 font-medium">Progress</th>
                        <th className="text-left p-4 font-medium">Score</th>
                        <th className="text-left p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyLearners.map((learner) => (
                        <tr key={learner.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                {learner.name.charAt(0)}
                              </div>
                              {learner.name}
                            </div>
                          </td>
                          <td className="p-4">{learner.course}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Progress value={learner.progress} className="h-2 w-20" />
                              <span className="text-sm">{learner.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {learner.score}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {learner.progress === 100 ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Agent Management</h2>
              <ConfigureAgentsDialog onAgentsUpdate={handleAgentsUpdate} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemAgents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        {agent.name !== agent.originalName && (
                          <p className="text-sm text-muted-foreground">({agent.originalName})</p>
                        )}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${agent.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Interactions</span>
                        <span className="font-medium">{agent.interactions || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Efficiency</span>
                        <span className="font-medium">{agent.efficiency || 90}%</span>
                      </div>
                      <Progress value={agent.efficiency || 90} className="h-2" />
                      <Badge 
                        variant={agent.active ? 'default' : 'secondary'}
                        className="w-full justify-center"
                      >
                        {agent.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {systemAgents.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Agents Configured</h3>
                  <p className="text-gray-500 mb-4">Get started by adding some AI agents to your system.</p>
                  <ConfigureAgentsDialog 
                    onAgentsUpdate={handleAgentsUpdate}
                    trigger={
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Your First Agent
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {isLearnerManager && (
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
