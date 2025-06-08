import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Brain, ArrowLeft, Upload, Link, FileText, 
  CheckCircle, PlayCircle, Zap, BookOpen,
  Users, Settings, MessageSquare 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
}

const CreateCourse = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [systemAgents, setSystemAgents] = useState<Agent[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('skillforge_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.userType !== 'admin' || parsed.adminRole !== 'content-creator') {
        navigate('/admin');
      } else {
        setUser(parsed);
      }
    } else {
      navigate('/login');
    }

    // Load system agents
    const savedAgents = localStorage.getItem('skillforge_system_agents');
    if (savedAgents) {
      const agents = JSON.parse(savedAgents);
      setSystemAgents(agents.filter((agent: Agent) => agent.active));
    }
  }, [navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) added successfully.`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const canProceedToGeneration = () => {
    return selectedAgents.length > 0 && 
           courseTitle.trim() && 
           courseDescription.trim() &&
           agentPrompt.trim() &&
           (uploadedFiles.length > 0 || googleDriveLink.trim());
  };

  const handleGenerateCourse = async () => {
    if (!canProceedToGeneration()) return;

    setIsGenerating(true);
    
    // Simulate course generation
    setTimeout(() => {
      const mockCourse = {
        title: courseTitle,
        description: courseDescription,
        modules: [
          {
            id: 1,
            title: "Introduction to " + courseTitle,
            lessons: ["Overview", "Key Concepts", "Getting Started"],
            duration: "2 hours"
          },
          {
            id: 2,
            title: "Core Principles",
            lessons: ["Fundamentals", "Best Practices", "Common Patterns"],
            duration: "3 hours"
          },
          {
            id: 3,
            title: "Advanced Topics",
            lessons: ["Advanced Concepts", "Case Studies", "Real-world Applications"],
            duration: "4 hours"
          }
        ],
        totalDuration: "9 hours",
        difficulty: "Intermediate",
        prerequisites: ["Basic understanding of the subject"],
        learningObjectives: [
          "Understand core concepts",
          "Apply knowledge in practical scenarios",
          "Develop expertise in the field"
        ]
      };
      
      setGeneratedCourse(mockCourse);
      setIsGenerating(false);
      setCurrentStep(3);
      
      toast({
        title: "Course Generated!",
        description: "Your course has been successfully created by the AI agents.",
      });
    }, 3000);
  };

  const handleApproveCourse = () => {
    toast({
      title: "Course Approved!",
      description: "The course has been approved and is now available for assignment.",
    });
    navigate('/admin');
  };

  const handleAddQuiz = () => {
    toast({
      title: "Quiz Generation Started",
      description: "Assessment Agent is creating quizzes for this course.",
    });
  };

  if (!user) return null;

  const relevantAgents = systemAgents.filter(agent => 
    agent.id === 'content-curator' || agent.id === 'assessment-agent'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create Course</h1>
                <p className="text-sm text-gray-500">AI-Powered Course Generation</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Setup' : step === 2 ? 'Generation' : 'Review & Approve'}
                </span>
                {step < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Setup */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Course Setup
                </CardTitle>
                <CardDescription>
                  Configure your course details and select AI agents to help create the content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="courseTitle">Course Title</Label>
                      <Input
                        id="courseTitle"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="Enter course title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseDescription">Course Description</Label>
                      <Textarea
                        id="courseDescription"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        placeholder="Describe what this course will cover"
                        className="mt-1 h-32"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Select AI Agents</Label>
                      <div className="mt-2 space-y-3">
                        {relevantAgents.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">
                            <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>No active Content Curator or Assessment agents found.</p>
                            <p className="text-sm">Please configure agents first.</p>
                          </div>
                        ) : (
                          relevantAgents.map((agent) => (
                            <div key={agent.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              <Checkbox
                                id={agent.id}
                                checked={selectedAgents.includes(agent.id)}
                                onCheckedChange={() => handleAgentSelection(agent.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label htmlFor={agent.id} className="font-medium cursor-pointer">
                                  {agent.name}
                                </Label>
                                <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Course Materials
                </CardTitle>
                <CardDescription>
                  Upload documents or provide links to source materials for course generation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList>
                    <TabsTrigger value="upload">Upload Files</TabsTrigger>
                    <TabsTrigger value="drive">Google Drive</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-lg font-medium text-gray-900">Click to upload files</span>
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.md"
                          />
                        </Label>
                        <p className="text-gray-500">Support: PDF, DOC, DOCX, TXT, MD</p>
                      </div>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files:</Label>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="drive" className="space-y-4">
                    <div>
                      <Label htmlFor="driveLink">Google Drive Folder Link</Label>
                      <div className="flex space-x-2 mt-1">
                        <div className="flex-1 relative">
                          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="driveLink"
                            value={googleDriveLink}
                            onChange={(e) => setGoogleDriveLink(e.target.value)}
                            placeholder="https://drive.google.com/drive/folders/..."
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <Label htmlFor="agentPrompt">Instructions for AI Agents</Label>
                  <Textarea
                    id="agentPrompt"
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    placeholder="Provide detailed instructions for the AI agents on how to structure and create the course content..."
                    className="mt-1 h-32"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToGeneration()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue to Generation
                    <PlayCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Generation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Course Generation
                </CardTitle>
                <CardDescription>
                  Your selected agents are working together to create the perfect course.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isGenerating ? (
                  <div className="text-center py-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Ready to Generate Your Course</h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {selectedAgents.map(agentId => {
                          const agent = systemAgents.find(a => a.id === agentId);
                          return agent ? (
                            <Badge key={agentId} variant="outline" className="bg-indigo-50 text-indigo-700">
                              {agent.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      <Button
                        onClick={handleGenerateCourse}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        Generate Course with AI
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <h3 className="text-lg font-medium">Generating Your Course...</h3>
                      <p className="text-gray-500">AI agents are analyzing your materials and creating structured content.</p>
                      <div className="max-w-md mx-auto">
                        <Progress value={66} className="h-2" />
                        <p className="text-sm text-gray-500 mt-2">Processing documents and generating modules...</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Review & Approve */}
        {currentStep === 3 && generatedCourse && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Preview
                </CardTitle>
                <CardDescription>
                  Review the generated course and approve it or request modifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{generatedCourse.title}</h3>
                        <p className="text-gray-600 mt-2">{generatedCourse.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold">{generatedCourse.totalDuration}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Difficulty</p>
                          <p className="font-semibold">{generatedCourse.difficulty}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {generatedCourse.learningObjectives.map((objective: string, index: number) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Course Modules</h4>
                        <div className="space-y-3">
                          {generatedCourse.modules.map((module: any) => (
                            <div key={module.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium">{module.title}</h5>
                                <Badge variant="outline">{module.duration}</Badge>
                              </div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {module.lessons.map((lesson: string, index: number) => (
                                  <li key={index}>• {lesson}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button
                            onClick={handleApproveCourse}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Course
                          </Button>
                          <Button
                            onClick={handleAddQuiz}
                            variant="outline"
                            className="w-full"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Quiz
                          </Button>
                          <Button
                            onClick={() => setCurrentStep(1)}
                            variant="outline"
                            className="w-full"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Modify
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Course Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Modules:</span>
                            <span className="font-medium">{generatedCourse.modules.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Lessons:</span>
                            <span className="font-medium">
                              {generatedCourse.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Est. Completion:</span>
                            <span className="font-medium">{generatedCourse.totalDuration}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
