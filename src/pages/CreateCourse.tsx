
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Upload, FileText, Link2, Users, 
  CheckCircle, Clock, ArrowLeft, Plus,
  BookOpen, Target, Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  capabilities: string[];
}

interface CourseData {
  title: string;
  description: string;
  selectedAgents: string[];
  documents: File[];
  driveLink: string;
  prompt: string;
  status: 'draft' | 'generating' | 'review' | 'completed';
  modules: any[];
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    selectedAgents: [],
    documents: [],
    driveLink: '',
    prompt: '',
    status: 'draft',
    modules: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);

  const availableAgents: Agent[] = [
    {
      id: 'content-curator',
      name: 'Content Curator Agent',
      description: 'Converts documents into structured learning modules',
      icon: BookOpen,
      capabilities: ['Document Analysis', 'Content Structuring', 'Module Creation', 'Learning Path Design']
    },
    {
      id: 'assessment-agent',
      name: 'Assessment Agent',
      description: 'Creates quizzes and role-specific evaluations',
      icon: Target,
      capabilities: ['Quiz Generation', 'Assessment Creation', 'Progress Evaluation', 'Skill Testing']
    }
  ];

  const handleAgentToggle = (agentId: string) => {
    setCourseData(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(agentId)
        ? prev.selectedAgents.filter(id => id !== agentId)
        : [...prev.selectedAgents, agentId]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setCourseData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateCourse = async () => {
    if (!courseData.title || courseData.selectedAgents.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a course title and select at least one agent.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setCourseData(prev => ({ ...prev, status: 'generating' }));

    // Simulate AI course generation
    setTimeout(() => {
      const mockCourse = {
        id: Date.now().toString(),
        title: courseData.title,
        description: courseData.description,
        modules: [
          {
            id: '1',
            title: 'Introduction to ' + courseData.title,
            duration: '45 mins',
            content: 'Overview and fundamentals',
            type: 'video'
          },
          {
            id: '2',
            title: 'Core Concepts',
            duration: '60 mins',
            content: 'Detailed exploration of key topics',
            type: 'interactive'
          },
          {
            id: '3',
            title: 'Practical Applications',
            duration: '90 mins',
            content: 'Hands-on exercises and examples',
            type: 'exercise'
          }
        ],
        estimatedDuration: '3.5 hours',
        difficulty: 'Intermediate',
        hasQuiz: courseData.selectedAgents.includes('assessment-agent')
      };

      setGeneratedCourse(mockCourse);
      setCourseData(prev => ({ ...prev, status: 'review' }));
      setIsGenerating(false);
      setCurrentStep(3);

      toast({
        title: "Course Generated Successfully!",
        description: "Your course has been created and is ready for review.",
      });
    }, 3000);
  };

  const handleApproveCourse = () => {
    setCourseData(prev => ({ ...prev, status: 'completed' }));
    toast({
      title: "Course Approved!",
      description: "The course is now available for assignment to learners.",
    });
    
    // Store course in localStorage for demo
    const existingCourses = JSON.parse(localStorage.getItem('skillforge_courses') || '[]');
    existingCourses.push(generatedCourse);
    localStorage.setItem('skillforge_courses', JSON.stringify(existingCourses));
    
    navigate('/admin');
  };

  const handleAddQuiz = () => {
    if (!courseData.selectedAgents.includes('assessment-agent')) {
      toast({
        title: "Assessment Agent Required",
        description: "Please select the Assessment Agent to add quizzes.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quiz Generation Started",
      description: "Assessment Agent is creating quizzes for this course.",
    });

    // Simulate quiz generation
    setTimeout(() => {
      setGeneratedCourse(prev => ({
        ...prev,
        quiz: {
          questions: 10,
          duration: '30 mins',
          passingScore: 80
        }
      }));

      toast({
        title: "Quiz Added Successfully!",
        description: "Assessment questions have been integrated into the course.",
      });
    }, 2000);
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
                <h1 className="text-xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-sm text-gray-500">AI-powered course creation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={currentStep.toString()} className="space-y-6">
          <TabsList className="bg-white shadow-sm border w-full justify-start">
            <TabsTrigger value="1" disabled={currentStep < 1}>Course Setup</TabsTrigger>
            <TabsTrigger value="2" disabled={currentStep < 2}>AI Generation</TabsTrigger>
            <TabsTrigger value="3" disabled={currentStep < 3}>Review & Approve</TabsTrigger>
          </TabsList>

          {/* Step 1: Course Setup */}
          <TabsContent value="1" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Course Information
                  </CardTitle>
                  <CardDescription>
                    Provide basic details about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter course title..."
                      value={courseData.title}
                      onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this course will cover..."
                      value={courseData.description}
                      onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Agent Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Select AI Agents
                  </CardTitle>
                  <CardDescription>
                    Choose which agents will help create your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableAgents.map((agent) => (
                    <div key={agent.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={courseData.selectedAgents.includes(agent.id)}
                            onCheckedChange={() => handleAgentToggle(agent.id)}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <agent.icon className="h-4 w-4 text-indigo-600" />
                              <span className="font-medium">{agent.name}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-6">
                        {agent.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Content Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Content Sources
                </CardTitle>
                <CardDescription>
                  Upload documents or provide links to source materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="space-y-3">
                  <Label>Upload Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm">
                      <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-500">
                        Click to upload
                      </label>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT, MD up to 10MB each</p>
                  </div>
                  
                  {courseData.documents.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files</Label>
                      {courseData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Google Drive Link */}
                <div className="space-y-2">
                  <Label htmlFor="drive-link">Google Drive Folder Link</Label>
                  <div className="flex space-x-2">
                    <Link2 className="h-4 w-4 text-gray-400 mt-3" />
                    <Input
                      id="drive-link"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={courseData.driveLink}
                      onChange={(e) => setCourseData(prev => ({ ...prev, driveLink: e.target.value }))}
                    />
                  </div>
                </div>

                {/* AI Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">Instructions for AI Agents</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Provide specific instructions for how you want the course to be structured, target audience, learning objectives, etc..."
                    value={courseData.prompt}
                    onChange={(e) => setCourseData(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={!courseData.title || courseData.selectedAgents.length === 0}
              >
                Continue to Generation
              </Button>
            </div>
          </TabsContent>

          {/* Step 2: AI Generation */}
          <TabsContent value="2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Course Generation
                </CardTitle>
                <CardDescription>
                  Review your settings and generate the course content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generation Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Generation Summary</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Course:</strong> {courseData.title}</p>
                    <p><strong>Selected Agents:</strong> {courseData.selectedAgents.length}</p>
                    <p><strong>Documents:</strong> {courseData.documents.length} files</p>
                    {courseData.driveLink && <p><strong>Drive Link:</strong> Provided</p>}
                  </div>
                </div>

                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <span>AI agents are creating your course...</span>
                    </div>
                    <Progress value={66} className="w-full max-w-md mx-auto" />
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>✓ Content Curator analyzing documents</p>
                      <p>✓ Structuring learning modules</p>
                      <p className="text-indigo-600">⟳ Assessment Agent preparing evaluations</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button
                      onClick={handleGenerateCourse}
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Brain className="h-5 w-5 mr-2" />
                      Generate Course with AI
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Review & Approve */}
          <TabsContent value="3" className="space-y-6">
            {generatedCourse && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Generated Course Preview
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Ready for Review
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">Duration</h3>
                        <p className="text-2xl font-bold text-indigo-600">{generatedCourse.estimatedDuration}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">Modules</h3>
                        <p className="text-2xl font-bold text-indigo-600">{generatedCourse.modules.length}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900">Difficulty</h3>
                        <p className="text-2xl font-bold text-indigo-600">{generatedCourse.difficulty}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium">Course Modules</h3>
                      {generatedCourse.modules.map((module: any, index: number) => (
                        <div key={module.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{index + 1}. {module.title}</h4>
                              <p className="text-sm text-gray-500">{module.content}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{module.type}</Badge>
                              <p className="text-sm text-gray-500 mt-1">{module.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {generatedCourse.quiz ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 mb-2">✓ Assessment Added</h3>
                        <div className="text-sm text-green-800 space-y-1">
                          <p>Questions: {generatedCourse.quiz.questions}</p>
                          <p>Duration: {generatedCourse.quiz.duration}</p>
                          <p>Passing Score: {generatedCourse.quiz.passingScore}%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-yellow-900">Add Assessment</h3>
                            <p className="text-sm text-yellow-800">Generate quizzes and evaluations for this course</p>
                          </div>
                          <Button onClick={handleAddQuiz} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quiz
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back to Edit
                  </Button>
                  <Button
                    onClick={handleApproveCourse}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Publish Course
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateCourse;
