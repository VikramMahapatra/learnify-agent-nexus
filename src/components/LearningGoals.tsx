
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, Calendar, Clock, Award, TrendingUp, 
  Plus, Edit, Trash2, CheckCircle, AlertCircle 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'organization' | 'personal';
  timeframe: string;
  targetHours: number;
  currentHours: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'overdue';
  createdBy?: string;
}

const LearningGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeframe: '',
    targetHours: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const savedGoals = localStorage.getItem('skillforge_learning_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Load sample organization goals
      const sampleGoals: Goal[] = [
        {
          id: '1',
          title: 'Complete React Fundamentals',
          description: 'Master React basics and hooks',
          type: 'organization',
          timeframe: 'monthly',
          targetHours: 40,
          currentHours: 28,
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          status: 'active',
          createdBy: 'Course Manager'
        }
      ];
      setGoals(sampleGoals);
      localStorage.setItem('skillforge_learning_goals', JSON.stringify(sampleGoals));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.timeframe || !formData.targetHours) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: 'personal',
      timeframe: formData.timeframe,
      targetHours: parseInt(formData.targetHours),
      currentHours: 0,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('skillforge_learning_goals', JSON.stringify(updatedGoals));

    toast({
      title: "Success",
      description: "Personal learning goal created successfully!"
    });

    setFormData({
      title: '',
      description: '',
      timeframe: '',
      targetHours: '',
      startDate: '',
      endDate: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (goalToDelete?.type === 'organization') {
      toast({
        title: "Error",
        description: "Cannot delete organization goals.",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('skillforge_learning_goals', JSON.stringify(updatedGoals));

    toast({
      title: "Success",
      description: "Personal goal deleted successfully!"
    });
  };

  const organizationGoals = goals.filter(g => g.type === 'organization');
  const personalGoals = goals.filter(g => g.type === 'personal');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Goals</h2>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Personal Goal
        </Button>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="bg-white shadow-sm border">
          <TabsTrigger value="organization">Organization Goals</TabsTrigger>
          <TabsTrigger value="personal">Personal Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Goals Set by Course Manager
              </CardTitle>
              <CardDescription>
                These goals are assigned by your organization and cannot be modified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {organizationGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No organization goals assigned yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {organizationGoals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{goal.title}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {goal.timeframe}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.currentHours}/{goal.targetHours} hours</span>
                        </div>
                        <Progress value={(goal.currentHours / goal.targetHours) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                          <span>End: {new Date(goal.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add Personal Learning Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Goal Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Master JavaScript"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeframe">Timeframe *</Label>
                      <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your learning goal..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="targetHours">Target Hours *</Label>
                      <Input
                        id="targetHours"
                        type="number"
                        value={formData.targetHours}
                        onChange={(e) => handleInputChange('targetHours', e.target.value)}
                        placeholder="e.g., 40"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Create Goal
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                My Personal Goals
              </CardTitle>
              <CardDescription>
                Goals you've set for yourself. You can edit or remove these anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {personalGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No personal goals set yet.</p>
                  <p className="text-sm">Click "Add Personal Goal" to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {personalGoals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{goal.title}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {goal.timeframe}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.currentHours}/{goal.targetHours} hours</span>
                        </div>
                        <Progress value={(goal.currentHours / goal.targetHours) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                          <span>End: {new Date(goal.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningGoals;
