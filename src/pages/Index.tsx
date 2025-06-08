
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, Brain, Users, BookOpen, TrendingUp, 
  Zap, Target, Award, ArrowRight, ChevronRight 
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Advanced AI agents provide personalized tutoring and adaptive learning paths.',
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Separate interfaces for admins and learners with tailored functionalities.',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Create, manage, and track learning paths with integrated assessments.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Real-time analytics and performance monitoring for better outcomes.',
    },
    {
      icon: Zap,
      title: 'Interactive Learning',
      description: 'Roleplay scenarios and interactive content for engaging experiences.',
    },
    {
      icon: Target,
      title: 'Skill Mapping',
      description: 'Track skill development and identify learning gaps automatically.',
    },
  ];

  const agents = [
    { name: 'Tutor Agent', description: 'Personalized answers and training guidance' },
    { name: 'Content Curator', description: 'Converts docs to structured learning modules' },
    { name: 'Assessment Agent', description: 'Creates quizzes and role-specific evaluations' },
    { name: 'Roleplay Agent', description: 'Simulates real-world interactions' },
    { name: 'Skill Tracker', description: 'Maps training to skill gaps' },
    { name: 'Memory Agent', description: 'Stores learning preferences and progress' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <GraduationCap className="h-16 w-16 text-indigo-600 mr-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillForge
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Forge your skills with AI-powered learning. An intelligent learning management system 
              that adapts to your needs and accelerates your growth with advanced AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6"
                onClick={() => navigate('/login')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-indigo-200 hover:bg-indigo-50"
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and deliver exceptional learning experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* AI Agents Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Your AI Learning Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Six specialized AI agents working together to personalize and optimize your learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-indigo-50">
                <CardHeader>
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-indigo-600 mr-3" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {agent.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of learners and organizations already using SkillForge to accelerate their growth.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6"
            onClick={() => navigate('/login')}
          >
            Start Your Journey
            <Award className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">SkillForge</span>
            </div>
            <p className="text-gray-600">
              Empowering learners and organizations with AI-driven education technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
