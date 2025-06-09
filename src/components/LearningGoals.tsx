
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, Clock, Calendar, TrendingUp, Edit, Plus, 
  CheckCircle, AlertCircle, BookOpen, Trophy 
} from 'lucide-react';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetHours: number;
  completedHours: number;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period: string;
  type: 'admin' | 'personal';
  assignedBy?: string;
  status: 'active' | 'completed' | 'overdue';
}

const LearningGoals = () => {
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetHours: '',
    timeframe: 'weekly' as const,
    period: ''
  });

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('skillforge_learning_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Initialize with some sample admin-set goals
      const sampleGoals: LearningGoal[] = [
        {
          id: '1',
          title: 'React Fundamentals Completion',
          description: 'Complete the React Fundamentals course with 15 hours of study per week',
          targetHours: 15,
          completedHours: 8,
          timeframe: 'weekly',
          period: '2024-W24',
          type: 'admin',
          assignedBy: 'Course Manager - John Smith',
          status: 'active'
        },
        {
          id: '2',
          title: 'Monthly Learning Target',
          description: 'Achieve 60 hours of learning this month across all courses',
          targetHours: 60,
          completedHours: 32,
          timeframe: 'monthly',
          period: '2024-06',
          type: 'admin',
          assignedBy: 'Course Manager - John Smith',
          status: 'active'
        }
      ];
      setGoals(sampleGoals);
      localStorage.setItem('skillforge_learning_goals', JSON.stringify(sampleGoals));
    }
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.targetHours || !newGoal.period) return;

    const goal: LearningGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetHours: parseInt(newGoal.targetHours),
      completedHours: 0,
      timeframe: newGoal.timeframe,
      period: newGoal.period,
      type: 'personal',
      status: 'active'
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem('skillforge_learning_goals', JSON.stringify(updatedGoals));
    
    setNewGoal({ title: '', description: '', targetHours: '', timeframe: 'weekly', period: '' });
    setShowCreateDialog(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const adminGoals = goals.filter(goal => goal.type === 'admin');
  const personalGoals = goals.filter(goal => goal.type === 'personal');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Goals</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Personal Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Personal Learning Goal</DialogTitle>
              <DialogDescription>Set a personal learning target to track your progress</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., Complete JavaScript Advanced Course"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetHours">Target Hours</Label>
                  <Input
                    id="targetHours"
                    type="number"
                    value={newGoal.targetHours}
                    onChange={(e) => setNewGoal({...newGoal, targetHours: e.target.value})}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
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
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  value={newGoal.period}
                  onChange={(e) => setNewGoal({...newGoal, period: e.target.value})}
                  placeholder="e.g., 2024-W25, 2024-06, 2024-Q2"
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="admin" className="space-y-6">
        <TabsList>
          <TabsTrigger value="admin">Organization Goals ({adminGoals.length})</TabsTrigger>
          <TabsTrigger value="personal">Personal Goals ({personalGoals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Goals set by your organization. These cannot be modified by you.
          </div>
          {adminGoals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No organization goals assigned yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {getStatusIcon(goal.status)}
                          <span className="ml-2">{goal.title}</span>
                        </CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {goal.timeframe}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{goal.completedHours}/{goal.targetHours} hours</span>
                        </div>
                        <Progress 
                          value={(goal.completedHours / goal.targetHours) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Period: {goal.period}</span>
                        {goal.assignedBy && (
                          <span className="text-gray-500">By: {goal.assignedBy}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Personal learning goals you've set for yourself. You can modify these anytime.
          </div>
          {personalGoals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No personal goals set yet.</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {getStatusIcon(goal.status)}
                          <span className="ml-2">{goal.title}</span>
                        </CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Personal
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{goal.completedHours}/{goal.targetHours} hours</span>
                        </div>
                        <Progress 
                          value={(goal.completedHours / goal.targetHours) * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Period: {goal.period}</span>
                        <Badge variant="secondary">{goal.timeframe}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningGoals;
