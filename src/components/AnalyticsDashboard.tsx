
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Calendar, Clock, TrendingUp, Users, BookOpen, 
  Target, Search, Filter, Download, Award, AlertCircle 
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('06');
  const [selectedWeek, setSelectedWeek] = useState('24');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample analytics data
  const analyticsData = {
    weekly: {
      totalLearners: 156,
      activeLearners: 142,
      completedCourses: 23,
      averageProgress: 67,
      totalStudyHours: 2340,
      goalsAchieved: 18,
      goalsOverdue: 5
    },
    monthly: {
      totalLearners: 156,
      activeLearners: 148,
      completedCourses: 89,
      averageProgress: 73,
      totalStudyHours: 9860,
      goalsAchieved: 67,
      goalsOverdue: 12
    },
    quarterly: {
      totalLearners: 156,
      activeLearners: 151,
      completedCourses: 234,
      averageProgress: 78,
      totalStudyHours: 28540,
      goalsAchieved: 189,
      goalsOverdue: 23
    },
    yearly: {
      totalLearners: 156,
      activeLearners: 153,
      completedCourses: 567,
      averageProgress: 82,
      totalStudyHours: 89230,
      goalsAchieved: 456,
      goalsOverdue: 34
    }
  };

  const learnerDetails = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@company.com',
      studyHours: 45,
      coursesCompleted: 3,
      currentProgress: 85,
      goalsAchieved: 4,
      lastActive: '2024-06-08'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@company.com',
      studyHours: 32,
      coursesCompleted: 2,
      currentProgress: 67,
      goalsAchieved: 2,
      lastActive: '2024-06-07'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@company.com',
      studyHours: 38,
      coursesCompleted: 4,
      currentProgress: 92,
      goalsAchieved: 5,
      lastActive: '2024-06-08'
    }
  ];

  const currentData = analyticsData[selectedPeriod as keyof typeof analyticsData];

  const getPeriodDisplay = () => {
    switch (selectedPeriod) {
      case 'weekly': return `Week ${selectedWeek}, ${selectedYear}`;
      case 'monthly': return `${selectedMonth}/${selectedYear}`;
      case 'quarterly': return `Q2 ${selectedYear}`;
      case 'yearly': return selectedYear;
      default: return '';
    }
  };

  const filteredLearners = learnerDetails.filter(learner =>
    learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    learner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Learning Analytics</h2>
          <p className="text-gray-600">Detailed insights into learner progress and performance</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Period Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="period">Period Type</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedPeriod === 'monthly' && (
              <div>
                <Label htmlFor="month">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => (
                      <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedPeriod === 'weekly' && (
              <div>
                <Label htmlFor="week">Week</Label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 52}, (_, i) => (
                      <SelectItem key={i+1} value={String(i+1)}>
                        Week {i+1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Showing data for: {getPeriodDisplay()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Learners</p>
                <p className="text-3xl font-bold">{currentData.activeLearners}</p>
                <p className="text-sm text-blue-200">of {currentData.totalLearners} total</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Courses Completed</p>
                <p className="text-3xl font-bold">{currentData.completedCourses}</p>
                <p className="text-sm text-green-200">this period</p>
              </div>
              <BookOpen className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Study Hours</p>
                <p className="text-3xl font-bold">{currentData.totalStudyHours.toLocaleString()}</p>
                <p className="text-sm text-purple-200">total hours</p>
              </div>
              <Clock className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Goals Achieved</p>
                <p className="text-3xl font-bold">{currentData.goalsAchieved}</p>
                <p className="text-sm text-orange-200">{currentData.goalsOverdue} overdue</p>
              </div>
              <Target className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learners">Learner Details</TabsTrigger>
          <TabsTrigger value="courses">Course Analytics</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Progress</span>
                    <span className="font-medium">{currentData.averageProgress}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Completion Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Engagement Rate</span>
                    <span className="font-medium">91%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Avg. Study Hours/Learner</span>
                    <span className="font-medium">{Math.round(currentData.totalStudyHours / currentData.activeLearners)} hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm">Overdue Goals</span>
                    <Badge variant="destructive">{currentData.goalsOverdue}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm">Inactive Learners</span>
                    <Badge variant="secondary">{currentData.totalLearners - currentData.activeLearners}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Courses Behind Schedule</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learners" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Individual Learner Performance</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search learners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredLearners.map((learner) => (
              <Card key={learner.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {learner.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{learner.name}</h4>
                        <p className="text-sm text-gray-500">{learner.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{learner.studyHours}</p>
                        <p className="text-xs text-gray-500">Study Hours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{learner.coursesCompleted}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{learner.currentProgress}%</p>
                        <p className="text-xs text-gray-500">Progress</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{learner.goalsAchieved}</p>
                        <p className="text-xs text-gray-500">Goals</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Course analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Goal tracking analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
