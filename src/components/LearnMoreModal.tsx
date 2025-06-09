
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, Users, BookOpen, TrendingUp, Target, Award,
  CheckCircle, Clock, BarChart, MessageCircle, Settings, Zap
} from 'lucide-react';

interface LearnMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LearnMoreModal = ({ open, onOpenChange }: LearnMoreModalProps) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning Agents',
      description: 'Six specialized AI agents work together to personalize your learning experience',
      details: ['Tutor Agent for personalized guidance', 'Assessment Agent for evaluations', 'Skill Tracker for progress mapping']
    },
    {
      icon: Users,
      title: 'Role-Based Management',
      description: 'Different interfaces and capabilities for different user types',
      details: ['Admin Dashboard for system management', 'Course Manager for content & assignments', 'Learner Dashboard for learning journey']
    },
    {
      icon: Target,
      title: 'Smart Goal Setting',
      description: 'Dual-layer goal system for comprehensive learning management',
      details: ['Admin-set organizational goals', 'Personal learning objectives', 'Time-bound targets (daily/weekly/monthly)']
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Course Management',
      description: 'Complete learning path creation and management system',
      details: ['Interactive lessons and quizzes', 'Progress tracking', 'Course assignment and monitoring']
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Detailed insights into learning progress and performance',
      details: ['Granular progress tracking', 'Performance analytics', 'Time-based reporting (daily/weekly/monthly/quarterly)']
    },
    {
      icon: MessageCircle,
      title: 'Interactive Learning',
      description: 'Engaging learning experiences with AI assistance',
      details: ['Roleplay scenarios', 'Real-time AI tutoring', 'Adaptive content delivery']
    }
  ];

  const userRoles = [
    {
      title: 'System Admin',
      description: 'Complete system oversight and management',
      capabilities: ['User management', 'System configuration', 'AI agent setup', 'Global analytics']
    },
    {
      title: 'Course Manager',
      description: 'Content creation and learner assignment',
      capabilities: ['Create and manage courses', 'Assign courses to learners', 'Set learning goals', 'Track progress']
    },
    {
      title: 'Learner Manager',
      description: 'Learner oversight and analytics',
      capabilities: ['Monitor learner progress', 'Access detailed analytics', 'Generate reports', 'Performance insights']
    },
    {
      title: 'Learner',
      description: 'Personalized learning experience',
      capabilities: ['Access assigned courses', 'Set personal goals', 'Interactive learning', 'Progress tracking']
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About SkillForge
          </DialogTitle>
          <DialogDescription className="text-lg">
            Discover how SkillForge revolutionizes learning with AI-powered features and intelligent management systems.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Core Features */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-indigo-600" />
              Core Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <feature.icon className="h-5 w-5 mr-2 text-indigo-600" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* User Roles */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-indigo-600" />
              User Roles & Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRoles.map((role, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {role.capabilities.map((capability, idx) => (
                        <Badge key={idx} variant="outline" className="mr-2 mb-2">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Agents Overview */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
              <Brain className="h-6 w-6 mr-2 text-indigo-600" />
              AI Learning Agents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Tutor Agent', role: 'Personalized guidance and support' },
                { name: 'Content Curator', role: 'Converts documents to learning modules' },
                { name: 'Assessment Agent', role: 'Creates and evaluates quizzes' },
                { name: 'Roleplay Agent', role: 'Simulates real-world scenarios' },
                { name: 'Skill Tracker', role: 'Maps learning to skill development' },
                { name: 'Memory Agent', role: 'Stores preferences and progress' }
              ].map((agent, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardHeader>
                    <Brain className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                    <CardTitle className="text-base">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{agent.role}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
